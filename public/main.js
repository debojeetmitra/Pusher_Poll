document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById("vote-form");

  // Form Submit Event
  form.addEventListener("submit", (e) => {
    const choice = document.querySelector("input[name=os]:checked").value;
    const data = { os: choice };

    fetch("http://localhost:3000/poll", {
      method: "POST",
      body: JSON.stringify(data),
      headers: new Headers({
        "Content-Type": "application/json",
      }),
    })
      .then((res) => res.json())
      .then((data) => console.log("Vote submitted", data))
      .catch((err) => console.log("Error:", err));

    e.preventDefault();
  });

  // Fetch votes and render chart
  fetch("http://localhost:3000/poll")
    .then((res) => res.json())
    .then((data) => {
      const votes = data.votes || [];
      const totalVotes = votes.length;

      const voteCounts = votes.reduce((acc, vote) => {
        acc[vote.os] = (acc[vote.os] || 0) + parseInt(vote.points);
        return acc;
      }, {});

      let dataPoints = [
        { label: "Windows", y: voteCounts.Windows || 0 },
        { label: "MacOS", y: voteCounts.MacOS || 0 },
        { label: "Linux", y: voteCounts.Linux || 0 },
        { label: "Other", y: voteCounts.Other || 0 },
      ];

      // Check if chartContainer exists before rendering
      const chartContainer = document.getElementById("chartContainer");
      if (chartContainer) {
        const chart = new CanvasJS.Chart("chartContainer", {
          animationEnabled: true,
          theme: "theme1",
          title: {
            text: `Total Votes ${totalVotes}`,
          },
          data: [
            {
              type: "column",
              dataPoints: dataPoints,
            },
          ],
        });
        chart.render();
      }

      // Pusher setup
      var pusher = new Pusher("1896944", {  // Replace with live Pusher app ID
        cluster: "ap2",
      });

      var channel = pusher.subscribe("os-poll");
      channel.bind("os-vote", function (data) {
        dataPoints = dataPoints.map((x) => {
          if (x.label === data.os) {
            x.y += data.points;
            return x;
          }
          return x;
        });
        if (chartContainer) {
          chart.render();  // Re-render the chart to reflect updated data
        }
      });
    })
    .catch((err) => console.error("Error fetching data:", err));
});
