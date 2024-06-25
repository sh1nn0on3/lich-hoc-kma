(function () {
  function extractCourseData() {
    const rows = document.querySelectorAll("tr.cssRangeItem2");
    const result = new Set();
    rows.forEach((row) => {
      const className = row.querySelector(
        'span[id^="gridRegistration_lblCourseClass_"]'
      ).textContent;
      const timeInfo = row.querySelectorAll("td")[4].innerHTML.split("<br>");

      const dateRange = timeInfo[0].match(
        /Từ (\d{2}\/\d{2}\/\d{4}) đến (\d{2}\/\d{2}\/\d{4})/
      );
      const startDate = dateRange[1];
      const endDate = dateRange[2];
      const schedulePattern = /Thứ (\d) tiết ([\d,]+)/g;
      const schedules = {};
      timeInfo.forEach((info) => {
        let match;
        while ((match = schedulePattern.exec(info)) !== null) {
          const day = parseInt(match[1]);
          const periods = match[2].split(",").map(Number);
          const start = Math.min(...periods);
          const end = Math.max(...periods);
          if (!schedules[day]) schedules[day] = [];
          schedules[day].push(`${start}->${end}`);
        }
      });
      Object.entries(schedules).forEach(([day, times]) => {
        times.forEach((time) => {
          result.add(
            JSON.stringify([className, parseInt(day), startDate, endDate, time])
          );
        });
      });
    });
    return Array.from(result).map(JSON.parse);
  }

  function displayResults(data) {
    const resultDiv = document.createElement("div");
    resultDiv.style.position = "fixed";
    resultDiv.style.top = "10px";
    resultDiv.style.right = "10px";
    resultDiv.style.width = "300px";
    resultDiv.style.height = "400px";
    resultDiv.style.overflow = "auto";
    resultDiv.style.backgroundColor = "white";
    resultDiv.style.border = "1px solid black";
    resultDiv.style.padding = "10px";
    resultDiv.style.zIndex = "9999";

    const buttonContainer = document.createElement("div");
    buttonContainer.style.display = "flex";
    buttonContainer.style.justifyContent = "space-between";
    buttonContainer.style.marginBottom = "10px";

    const closeButton = document.createElement("button");
    closeButton.textContent = "Đóng";
    closeButton.style.padding = "5px 10px";
    closeButton.style.cursor = "pointer";
    closeButton.onclick = function () {
      document.body.removeChild(resultDiv);
    };
    buttonContainer.appendChild(closeButton);

    const copyButton = document.createElement("button");
    copyButton.textContent = "Sao chép";
    copyButton.style.padding = "5px 10px";
    copyButton.style.cursor = "pointer";
    copyButton.style.backgroundColor = "#4CAF50";
    copyButton.style.color = "white";
    copyButton.style.border = "none";
    copyButton.style.transition = "background-color 0.3s";

    copyButton.onclick = function () {
      const textArea = document.createElement("textarea");
      const formattedData = data
        .map((item) => JSON.stringify(item))
        .join(",\n");
      textArea.value = formattedData;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);

      // Thay đổi màu và văn bản của nút
      copyButton.style.backgroundColor = "#45a049";
      copyButton.textContent = "Đã sao chép!";

      // Đặt lại nút sau 2 giây
      setTimeout(() => {
        copyButton.style.backgroundColor = "#4CAF50";
        copyButton.textContent = "Sao chép";
      }, 2000);
    };
    buttonContainer.appendChild(copyButton);

    resultDiv.appendChild(buttonContainer);

    const pre = document.createElement("pre");
    pre.textContent = JSON.stringify(data, null, 2);
    resultDiv.appendChild(pre);

    document.body.appendChild(resultDiv);
  }

  const extractedData = extractCourseData();
  displayResults(extractedData);
})();
