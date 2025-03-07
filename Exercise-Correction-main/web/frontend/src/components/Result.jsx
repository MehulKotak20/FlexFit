import React, { useState, useMemo } from "react";
import Video from "./VideoPlayer"; // Assuming Video component exists
import "./Result.css"; // Import the CSS file

const ResultSection = ({ data }) => {
  const [selectedDisplay, setSelectedDisplay] = useState("summary");
  const [videoStart, setVideoStart] = useState(0);

  // Memoizing summary data computation
  const summaryData = useMemo(() => {
    let results = {
      total: 0,
      totalInString: "",
      details: {},
    };

    let totalErrors = data.details.length;
    results.total = totalErrors;
    if (totalErrors === 0 || totalErrors === 1)
      results.totalInString = `${totalErrors} error`;
    else results.totalInString = `${totalErrors} errors`;

    data.details.forEach((error) => {
      let stage = error.stage;
      results.details[stage] = results.details[stage]
        ? results.details[stage] + 1
        : 1;
    });

    return results;
  }, [data]);

  const jumpToVideoLocation = (second) => {
    setSelectedDisplay("video");
    setVideoStart(second);
  };

  const byteToMB = (bytes) => {
    return Math.round(bytes / 1000000);
  };

  return (
    <section className="result-section">
      {/* Navigators */}
      <ul className="tab-links">
        <li
          className={selectedDisplay === "summary" ? "active" : ""}
          onClick={() => setSelectedDisplay("summary")}
        >
          Summary
        </li>
        <li
          className={selectedDisplay === "detail" ? "active" : ""}
          onClick={() => setSelectedDisplay("detail")}
        >
          Detail
        </li>
        <li
          className={selectedDisplay === "video" ? "active" : ""}
          onClick={() => setSelectedDisplay("video")}
        >
          Full Video
        </li>
      </ul>

      {/* Contents */}
      <div className="tab-container">
        {/* Summary content */}
        {selectedDisplay === "summary" && (
          <>
            <p className="main">
              {data.counter ? (
                data.type !== "bicep_curl" ? (
                  <>
                    <span className="info-color">Counter: {data.counter}</span>
                  </>
                ) : (
                  <>
                    Left arm counter: {data.counter.left_counter} - Right arm
                    counter: {data.counter.right_counter}
                  </>
                )
              ) : null}
            </p>

            <p className="main">
              There are
              <span className="error-color">
                {summaryData.totalInString}
              </span>{" "}
              found.
              {summaryData.total > 0 ? (
                <i className="fa-solid fa-circle-exclamation error-color" />
              ) : (
                <i className="fa-solid fa-circle-check" />
              )}
            </p>

            {summaryData.total > 0 && (
              <ul className="errors">
                {Object.entries(summaryData.details).map(([error, total]) => (
                  <li key={error}>
                    <i className="fa-solid fa-caret-right" />
                    {error}: {total}
                  </li>
                ))}
              </ul>
            )}
          </>
        )}

        {/* Detail content */}
        {selectedDisplay === "detail" && (
          <div className="box-error">
            {data.details.map((error, index) => (
              <div key={index}>
                <p>
                  {index + 1}. {error.stage} at{" "}
                  <span
                    className="error-time"
                    onClick={() => jumpToVideoLocation(error.timestamp)}
                  >
                    {error.timestamp} second
                  </span>
                </p>
                <img src={error.frame} alt={`Error at ${error.stage}`} />
                <hr />
              </div>
            ))}
          </div>
        )}

        {/* Full Video content */}
        {selectedDisplay === "video" && (
          <div className="video-container">
            <Video videoName={data.file_name} startAt={videoStart} />
          </div>
        )}
      </div>
    </section>
  );
};

export default ResultSection;
