import os
import mimetypes
import traceback
from datetime import datetime
from wsgiref.util import FileWrapper

from rest_framework import status
from rest_framework.decorators import api_view, parser_classes
from rest_framework.parsers import MultiPartParser
from django.http import StreamingHttpResponse
from django.http import JsonResponse

from detection.main import exercise_detection
from detection.utils import get_static_file_url



@api_view(["GET"])
def stream_video(request):
    """
    Query: video_name
    Stream video get from query
    """
    video_name = request.GET.get("video_name")
    if not video_name:
        return JsonResponse(
            status=status.HTTP_400_BAD_REQUEST,
            data={
                "message": "File name not given",
            },
        )

    static_url = get_static_file_url(f"media/{video_name}")
    if not static_url:
        return JsonResponse(
            status=status.HTTP_404_NOT_FOUND,
            data={
                "message": "File not found",
            },
        )

    # Get the video size and MIME type
    video_size = os.path.getsize(static_url)
    content_type, _ = mimetypes.guess_type(static_url)
    content_type = content_type or "application/octet-stream"

    # Get the Range header if available
    range_header = request.META.get("HTTP_RANGE", None)

    if range_header:
        # Parse the range header (e.g. "bytes=0-999999")
        byte_range = range_header.strip().replace("bytes=", "")
        start, end = byte_range.split("-")
        start = int(start)
        end = int(end) if end else video_size - 1
        chunk_size = end - start + 1

        # Open the file and send the chunk
        file = open(static_url, "rb")
        file.seek(start)
        response = StreamingHttpResponse(
            FileWrapper(file, chunk_size),
            status=206,  # Partial Content
            content_type=content_type,
        )
        response["Content-Range"] = f"bytes {start}-{end}/{video_size}"
        response["Accept-Ranges"] = "bytes"
        response["Content-Length"] = chunk_size
        return response
    else:
        # If no range is specified, send the whole file
        response = StreamingHttpResponse(
            FileWrapper(open(static_url, "rb")), content_type=content_type
        )
        response["Content-Length"] = video_size
        response["Accept-Ranges"] = "bytes"
        return response
        

@api_view(["POST"])
@parser_classes([MultiPartParser])
def upload_video(request):
    exercise_type = request.GET.get("type")
    if not exercise_type:
        return JsonResponse(
            status=status.HTTP_400_BAD_REQUEST,
            data={
                "message": "Exercise type has not given",
            },
        )

    try:
        if request.method == "POST":
            video = request.FILES["file"]

            # Convert any video to .mp4
            now = datetime.now()
            now = int(now.strftime("%Y%m%d%H%M%S"))
            name_to_save = f"video_{now}.mp4"

            # Process and Saved Video
            results, *other_data = exercise_detection(
                video_file_path=video.temporary_file_path(),
                video_name_to_save=name_to_save,
                exercise_type=exercise_type,
                rescale_percent=40,
            )

            # Convert images' path to URL
            host = request.build_absolute_uri("/")
            for index, error in enumerate(results):
                if error["frame"]:
                    results[index]["frame"] = host + f"static/images/{error['frame']}"

            response_data = {
                "type": exercise_type,
                "processed": True,
                "file_name": name_to_save,
                "details": results,
            }

            # Handle others data
            if exercise_type in ["squat", "lunge", "bicep_curl"]:
                response_data["counter"] = other_data[0]

            return JsonResponse(
                status=status.HTTP_200_OK,
                data=response_data,
            )

    except Exception as e:
        print(f"Error Video Processing: {e}")
        # traceback.print_exc()

        return JsonResponse(
            status=status.HTTP_400_BAD_REQUEST,
            data={
                "error": f"Error: {e}",
            },
        )
