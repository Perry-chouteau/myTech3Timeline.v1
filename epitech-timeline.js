google.charts.load("current", { packages: ["timeline"] });
google.charts.setOnLoadCallback(drawChart);
var today = new Date();
var timeline_data = null;

async function getTimelineData() {
  if (timeline_data) {
    return timeline_data.projects;
  }
  // var promo = new URLSearchParams(window.location.search).get("promo");
  // if (!promo) throw "Missing promo parameter in URL";
  var response = await fetch("data.json", {
    cache: "reload",
  });
  if (!response.ok) throw "Could not get timeline data: " + response.statusText;
  
  timeline_data = await response.json();
 
  $("#title").text(`Epitech Timeline - Promotion ${timeline_data.promo}`);
  document.title = `Epitech Timeline - Promotion ${timeline_data.promo}`;
  $("#semester").text(`Semester ${timeline_data.semester}`);

  return timeline_data.projects;
}

async function createDataTable(bttf_displayed, past_project_hidden) {
  var dataTable = new google.visualization.DataTable();
  dataTable.addColumn({ type: "string", id: "Module" });
  dataTable.addColumn({ type: "string", id: "Project" });
  dataTable.addColumn({ type: "date", id: "Start" });
  dataTable.addColumn({ type: "date", id: "End" });
  var now = new Date(today.getFullYear(), today.getMonth(), today.getDate());

  var data = await getTimelineData();

  if (!bttf_displayed) {
    data = data.filter((v) => !v.bttf);
  }
  if (past_project_hidden) {
    data = data.filter(el => {
      if (moment(today).diff(moment(el.end)) < 0)
        return el;
    })
  }
  data = data.map(function (v) {
    var end_date = new Date(v.end);
    end_date.setDate(end_date.getDate() + 1);
    return [v.module, v.project, new Date(v.start), end_date];
  });

  dataTable.addRows([["Now", "Now", now, now]]);
  dataTable.addRows(data);
  return dataTable;
}

async function updateChart(chart) {
  var bttf_displayed = window.localStorage.getItem("bttf") == "true";
  var past_projetc_hidden = window.localStorage.getItem("hide") === "true"
  var dataTable = await createDataTable(bttf_displayed, past_projetc_hidden);

  chart.draw(dataTable, {
    timeline: {
      colorByRowLabel: true,
    },
  });
}

async function drawChart() {
  var container = document.getElementById("timeline-container");
  var chart = new google.visualization.Timeline(container);

  try {
    await updateChart(chart);

    nowLine("timeline-container");

    google.visualization.events.addListener(chart, "onmouseover", function (
      obj
    ) {
      if (obj.row == 0) {
        $(".google-visualization-tooltip").css("display", "none");
      }
      nowLine("timeline-container");
    });

    google.visualization.events.addListener(chart, "onmouseout", function (
      obj
    ) {
      nowLine("timeline-container");
    });

    // Hide bttf button
    $("#bttf-button").click(async function () {
      var bttf_displayed = window.localStorage.getItem("bttf") == "true";
      window.localStorage.setItem("bttf", !bttf_displayed);
      await updateChart(chart);
    });

    // Hide past projects buttons
    $("#hide").click(async function () {
      var hide_status = JSON.parse(window.localStorage.getItem("hide"));
      window.localStorage.setItem("hide", !hide_status);
      await updateChart(chart);
    });

  } catch (e) {
    $("#timeline-container").text(e);
  }
}

function nowLine(div) {
  //get the height of the timeline div
  var height;
  $("#" + div + " rect").each(function (index) {
    var x = parseFloat($(this).attr("x"));
    var y = parseFloat($(this).attr("y"));

    if (x == 0 && y == 0) {
      height = parseFloat($(this).attr("height"));
    }
  });

  var nowWord = $("#" + div + ' text:contains("Now")');

  nowWord
    .prev()
    .first()
    .attr("height", height + "px")
    .attr("width", "1px")
    .attr("y", "0");
  // add this line to remove the display:none style on the vertical line
  $("#" + div + '  text:contains("Now")').each(function (idx, value) {
    if (idx == 0) {
      $(value).parent().find("rect").first().removeAttr("style");
    } else if (idx == 1) {
      $(value).parent().find("rect").first().attr("style", "display:none;");
    }
  });
}

var repourl = "https://github.com/Perry-chouteau/myTech2Timeline.v2";
$(document).ready(function () {

    function set_theme(dark) {
    var dark = dark || false;

    window.localStorage.setItem("dark", dark);

    if (dark) {
      $("body").addClass("dark");
      $("#switch").text("Switch to light");
    } else {
      $("body").removeClass("dark");
      $("#switch").text("Switch to dark");
    }
  }

  $("#switch").on("click", function () {
    set_theme(!$("body").hasClass("dark"));
    return false;
  });

  set_theme(window.localStorage.getItem("dark") == "true" ? true : false);
  setTimeout(function () {
    $("body").addClass("ready");
  }, 500);
});
