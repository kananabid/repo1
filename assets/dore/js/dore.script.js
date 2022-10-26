
  /* 01. Add Comas Util */
  $.fn.addCommas = function(nStr) {
  nStr += "";
  var x = nStr.split(".");
  var x1 = x[0];
  var x2 = x.length > 1 ? "." + x[1] : "";
  var rgx = /(\d+)(\d{3})/;
  while (rgx.test(x1)) {
  x1 = x1.replace(rgx, "$1" + "," + "$2");
}
  return x1 + x2;
};

  /* 02. Shift Select Plugin */
  $.shiftSelectable = function(element, config) {
  var plugin = this;
  config = $.extend(
{
  items: ".card"
},
  config
  );
  var $container = $(element);
  var $checkAll = null;
  var $boxes = $container.find("input[type='checkbox']");

  var lastChecked;
  if ($container.data("checkAll")) {
  $checkAll = $("#" + $container.data("checkAll"));
  $checkAll.on("click", function() {
  $boxes.prop("checked", $($checkAll).prop("checked")).trigger("change");
  document.activeElement.blur();
  controlActiveClasses();
});
}

  function itemClick(checkbox, shiftKey) {
  $(checkbox)
  .prop("checked", !$(checkbox).prop("checked"))
  .trigger("change");

  if (!lastChecked) {
  lastChecked = checkbox;
}
  if (lastChecked) {
  if (shiftKey) {
  var start = $boxes.index(checkbox);
  var end = $boxes.index(lastChecked);
  $boxes
  .slice(Math.min(start, end), Math.max(start, end) + 1)
  .prop("checked", lastChecked.checked)
  .trigger("change");
}
  lastChecked = checkbox;
}

  if ($checkAll) {
  var anyChecked = false;
  var allChecked = true;
  $boxes.each(function() {
  if ($(this).prop("checked")) {
  anyChecked = true;
} else {
  allChecked = false;
}
});
  if (anyChecked) {
  $checkAll.prop("indeterminate", anyChecked);
} else {
  $checkAll.prop("indeterminate", anyChecked);
  $checkAll.prop("checked", anyChecked);
}
  if (allChecked) {
  $checkAll.prop("indeterminate", false);
  $checkAll.prop("checked", allChecked);
}
}
  document.activeElement.blur();
  controlActiveClasses();
}

  $container.on("click", config.items, function(e) {
  if (
  $(e.target).is("a") ||
  $(e.target)
  .parent()
  .is("a")
  ) {
  return;
}

  if ($(e.target).is("input[type='checkbox']")) {
  e.preventDefault();
  e.stopPropagation();
}
  var checkbox = $(this).find("input[type='checkbox']")[0];
  itemClick(checkbox, e.shiftKey);
});

  function controlActiveClasses() {
  $boxes.each(function() {
  if ($(this).prop("checked")) {
  $(this)
  .parents(".card")
  .addClass("active");
} else {
  $(this)
  .parents(".card")
  .removeClass("active");
}
});
}

  plugin.selectAll = function() {
  if ($checkAll) {
  $boxes.prop("checked", true).trigger("change");
  $checkAll.prop("checked", true);
  $checkAll.prop("indeterminate", false);
  controlActiveClasses();
}
};

  plugin.deSelectAll = function() {
  if ($checkAll) {
  $boxes.prop("checked", false).trigger("change");
  $checkAll.prop("checked", false);
  $checkAll.prop("indeterminate", false);
  controlActiveClasses();
}
};

  plugin.rightClick = function(trigger) {
  var checkbox = $(trigger).find("input[type='checkbox']")[0];
  if ($(checkbox).prop("checked")) {
  return;
}
  plugin.deSelectAll();
  itemClick(checkbox, false);
};
};

  $.fn.shiftSelectable = function(options) {
  return this.each(function() {
  if (undefined == $(this).data("shiftSelectable")) {
  var plugin = new $.shiftSelectable(this, options);
  $(this).data("shiftSelectable", plugin);
}
});
};

  /* 03. Dore Main Plugin */
  $.dore = function(element, options) {
  var defaults = {};
  var plugin = this;
  plugin.settings = {};
  var $element = $(element);
  var element = element;

  var $shiftSelect;

  function init() {
  options = options || {};
  plugin.settings = $.extend({}, defaults, options);
  /* 03.01. Getting Colors from CSS */
  var rootStyle = getComputedStyle(document.body);
  var themeColor1 = rootStyle.getPropertyValue("--theme-color-1").trim();
  var themeColor2 = rootStyle.getPropertyValue("--theme-color-2").trim();
  var themeColor3 = rootStyle.getPropertyValue("--theme-color-3").trim();
  var themeColor4 = rootStyle.getPropertyValue("--theme-color-4").trim();
  var themeColor5 = rootStyle.getPropertyValue("--theme-color-5").trim();
  var themeColor6 = rootStyle.getPropertyValue("--theme-color-6").trim();
  var themeColor1_10 = rootStyle
  .getPropertyValue("--theme-color-1-10")
  .trim();
  var themeColor2_10 = rootStyle
  .getPropertyValue("--theme-color-2-10")
  .trim();
  var themeColor3_10 = rootStyle
  .getPropertyValue("--theme-color-3-10")
  .trim();
  var themeColor4_10 = rootStyle
  .getPropertyValue("--theme-color-4-10")
  .trim();

  var themeColor5_10 = rootStyle
  .getPropertyValue("--theme-color-5-10")
  .trim();
  var themeColor6_10 = rootStyle
  .getPropertyValue("--theme-color-6-10")
  .trim();

  var primaryColor = rootStyle.getPropertyValue("--primary-color").trim();
  var foregroundColor = rootStyle
  .getPropertyValue("--foreground-color")
  .trim();
  var separatorColor = rootStyle.getPropertyValue("--separator-color").trim();

  /* 03.02. Resize */
  var subHiddenBreakpoint = 1440;
  var searchHiddenBreakpoint = 768;
  var menuHiddenBreakpoint = 768;
  var subHiddenByClick = false;
  var firstInit = true;

  function onResize() {
  var windowHeight = $(window).outerHeight();
  var windowWidth = $(window).outerWidth();
  var navbarHeight = $(".navbar").outerHeight();

  var submenuMargin = parseInt(
  $(".sub-menu .scroll").css("margin-top"),
  10
  );
  $(".sub-menu .scroll").css(
  "height",
  windowHeight - navbarHeight - submenuMargin * 2
  );

  $(".main-menu .scroll").css("height", windowHeight - navbarHeight);
  $(".app-menu .scroll").css("height", windowHeight - navbarHeight - 40);

  if ($(".chat-app .scroll").length > 0 && chatAppScroll) {
  $(".chat-app .scroll").scrollTop(
  $(".chat-app .scroll").prop("scrollHeight")
  );
  chatAppScroll.update();
}

  if (windowWidth < menuHiddenBreakpoint) {
  $("#app-container").addClass("menu-mobile");
} else if (windowWidth < subHiddenBreakpoint) {
  $("#app-container").removeClass("menu-mobile");
  if ($("#app-container").hasClass("menu-default")) {
  // $("#app-container").attr("class", "menu-default menu-sub-hidden");
  $("#app-container").removeClass(allMenuClassNames);
  $("#app-container").addClass("menu-default menu-sub-hidden");
}
} else {
  $("#app-container").removeClass("menu-mobile");
  if (
  $("#app-container").hasClass("menu-default") &&
  $("#app-container").hasClass("menu-sub-hidden")
  ) {
  $("#app-container").removeClass("menu-sub-hidden");
}
}

  setMenuClassNames(0, true);
}

  $(window).on("resize", function(event) {
  if (event.originalEvent.isTrusted) {
  onResize();
}
});
  onResize();

  /* 03.03. Search */
  function searchIconClick() {
  if ($(window).outerWidth() < searchHiddenBreakpoint) {
  if ($(".search").hasClass("mobile-view")) {
  $(".search").removeClass("mobile-view");
  navigateToSearchPage();
} else {
  $(".search").addClass("mobile-view");
  $(".search input").focus();
}
} else {
  navigateToSearchPage();
}
}

  $(".search .search-icon").on("click", function() {
  searchIconClick();
});

  $(".search input").on("keyup", function(e) {
  if (e.which == 13) {
  navigateToSearchPage();
}
  if (e.which == 27) {
  hideSearchArea();
}
});

  function navigateToSearchPage() {
  var inputVal = $(".search input").val();
  var searchPath = $(".search").data("searchPath");
  if (inputVal != "") {
  $(".search input").val("");
  window.location.href = searchPath + inputVal;
}
}

  function hideSearchArea() {
  if ($(".search").hasClass("mobile-view")) {
  $(".search").removeClass("mobile-view");
  $(".search input").val("");
}
}

  $(document).on("click", function(event) {
  if (
  !$(event.target)
  .parents()
  .hasClass("search")
  ) {
  hideSearchArea();
}
});

  /* 03.04. Shift Selectable Init */
  $shiftSelect = $(".list").shiftSelectable();

  /* 03.05. Menu */
  var menuClickCount = 0;
  var allMenuClassNames = "menu-default menu-hidden sub-hidden main-hidden menu-sub-hidden main-show-temporary sub-show-temporary menu-mobile";
  function setMenuClassNames(clickIndex, calledFromResize, link) {
  menuClickCount = clickIndex;
  var container = $("#app-container");
  if (container.length == 0) {
  return;
}

  var link = link || getActiveMainMenuLink();

  //menu-default no subpage
  if (
  $(".sub-menu ul[data-link='" + link + "']").length == 0 &&
  (menuClickCount == 2 || calledFromResize)
  ) {
  if ($(window).outerWidth() >= menuHiddenBreakpoint) {
  if (isClassIncludedApp("menu-default")) {
  if (calledFromResize) {
  // $("#app-container").attr(
  //   "class",
  //   "menu-default menu-sub-hidden sub-hidden"
  // );
  $("#app-container").removeClass(allMenuClassNames);
  $("#app-container").addClass("menu-default menu-sub-hidden sub-hidden");
  menuClickCount = 1;
} else {
  // $("#app-container").attr(
  //   "class",
  //   "menu-default main-hidden menu-sub-hidden sub-hidden"
  // );
  $("#app-container").removeClass(allMenuClassNames);
  $("#app-container").addClass("menu-default main-hidden menu-sub-hidden sub-hidden");

  menuClickCount = 0;
}
  resizeCarousel();
  return;
}
}
}

  //menu-sub-hidden no subpage
  if (
  $(".sub-menu ul[data-link='" + link + "']").length == 0 &&
  (menuClickCount == 1 || calledFromResize)
  ) {
  if ($(window).outerWidth() >= menuHiddenBreakpoint) {
  if (isClassIncludedApp("menu-sub-hidden")) {
  if (calledFromResize) {
  // $("#app-container").attr("class", "menu-sub-hidden sub-hidden");
  $("#app-container").removeClass(allMenuClassNames);
  $("#app-container").addClass("menu-sub-hidden sub-hidden");
  menuClickCount = 0;
} else {
  // $("#app-container").attr(
  //   "class",
  //   "menu-sub-hidden main-hidden sub-hidden"
  // );
  $("#app-container").removeClass(allMenuClassNames);
  $("#app-container").addClass("menu-sub-hidden main-hidden sub-hidden");
  menuClickCount = -1;
}
  resizeCarousel();
  return;
}
}
}

  //menu-sub-hidden no subpage
  if (
  $(".sub-menu ul[data-link='" + link + "']").length == 0 &&
  (menuClickCount == 1 || calledFromResize)
  ) {
  if ($(window).outerWidth() >= menuHiddenBreakpoint) {
  if (isClassIncludedApp("menu-hidden")) {
  if (calledFromResize) {
  // $("#app-container").attr(
  //   "class",
  //   "menu-hidden main-hidden sub-hidden"
  // );
  $("#app-container").removeClass(allMenuClassNames);
  $("#app-container").addClass("menu-hidden main-hidden sub-hidden");

  menuClickCount = 0;
} else {
  // $("#app-container").attr(
  //   "class",
  //   "menu-hidden main-show-temporary"
  // );
  $("#app-container").removeClass(allMenuClassNames);
  $("#app-container").addClass("menu-hidden main-show-temporary");

  menuClickCount = 3;
}
  resizeCarousel();
  return;
}
}
}

  if (clickIndex % 4 == 0) {
  if (
  isClassIncludedApp("menu-default") &&
  isClassIncludedApp("menu-sub-hidden")
  ) {
  nextClasses = "menu-default menu-sub-hidden";
} else if (isClassIncludedApp("menu-default")) {
  nextClasses = "menu-default";
} else if (isClassIncludedApp("menu-sub-hidden")) {
  nextClasses = "menu-sub-hidden";
} else if (isClassIncludedApp("menu-hidden")) {
  nextClasses = "menu-hidden";
}
  menuClickCount = 0;
} else if (clickIndex % 4 == 1) {
  if (
  isClassIncludedApp("menu-default") &&
  isClassIncludedApp("menu-sub-hidden")
  ) {
  nextClasses = "menu-default menu-sub-hidden main-hidden sub-hidden";
} else if (isClassIncludedApp("menu-default")) {
  nextClasses = "menu-default sub-hidden";
} else if (isClassIncludedApp("menu-sub-hidden")) {
  nextClasses = "menu-sub-hidden main-hidden sub-hidden";
} else if (isClassIncludedApp("menu-hidden")) {
  nextClasses = "menu-hidden main-show-temporary";
}
} else if (clickIndex % 4 == 2) {
  if (
  isClassIncludedApp("menu-default") &&
  isClassIncludedApp("menu-sub-hidden")
  ) {
  nextClasses = "menu-default menu-sub-hidden sub-hidden";
} else if (isClassIncludedApp("menu-default")) {
  nextClasses = "menu-default main-hidden sub-hidden";
} else if (isClassIncludedApp("menu-sub-hidden")) {
  nextClasses = "menu-sub-hidden sub-hidden";
} else if (isClassIncludedApp("menu-hidden")) {
  nextClasses = "menu-hidden main-show-temporary sub-show-temporary";
}
} else if (clickIndex % 4 == 3) {
  if (
  isClassIncludedApp("menu-default") &&
  isClassIncludedApp("menu-sub-hidden")
  ) {
  nextClasses = "menu-default menu-sub-hidden sub-show-temporary";
} else if (isClassIncludedApp("menu-default")) {
  nextClasses = "menu-default sub-hidden";
} else if (isClassIncludedApp("menu-sub-hidden")) {
  nextClasses = "menu-sub-hidden sub-show-temporary";
} else if (isClassIncludedApp("menu-hidden")) {
  nextClasses = "menu-hidden main-show-temporary";
}
}
  if (isClassIncludedApp("menu-mobile")) {
  nextClasses += " menu-mobile";
}
  // container.attr("class", nextClasses);
  container.removeClass(allMenuClassNames);
  container.addClass(nextClasses);
  resizeCarousel();
}
  $(".menu-button").on("click", function(event) {
  event.preventDefault();
  setMenuClassNames(++menuClickCount);
});

  $(".menu-button-mobile").on("click", function(event) {
  event.preventDefault();
  $("#app-container")
  .removeClass("sub-show-temporary")
  .toggleClass("main-show-temporary");
  return false;
});

  $(".main-menu").on("click", "a", function(event) {
  event.preventDefault();

  var link = $(this)
  .attr("href")
  .replace("#", "");

  if ($(".sub-menu ul[data-link='" + link + "']").length == 0) {
  window.location.href = link;
  return;
}

  showSubMenu($(this).attr("href"));
  var container = $("#app-container");
  if (!$("#app-container").hasClass("menu-mobile")) {
  if (
  $("#app-container").hasClass("menu-sub-hidden") &&
  (menuClickCount == 2 || menuClickCount == 0)
  ) {
  setMenuClassNames(3, false, link);
} else if (
  $("#app-container").hasClass("menu-hidden") &&
  (menuClickCount == 1 || menuClickCount == 3)
  ) {
  setMenuClassNames(2, false, link);
} else if (
  $("#app-container").hasClass("menu-default") &&
  !$("#app-container").hasClass("menu-sub-hidden") &&
  (menuClickCount == 1 || menuClickCount == 3)
  ) {
  setMenuClassNames(0, false, link);
}
} else {
  $("#app-container").addClass("sub-show-temporary");
}
  return false;
});

  $(document).on("click", function(event) {
  if (
  !(
  $(event.target)
  .parents()
  .hasClass("menu-button") ||
  $(event.target).hasClass("menu-button") ||
  $(event.target)
  .parents()
  .hasClass("sidebar") ||
  $(event.target).hasClass("sidebar")
  )
  ) {
  if (
  $("#app-container").hasClass("menu-sub-hidden") &&
  menuClickCount == 3
  ) {
  var link = getActiveMainMenuLink();

  if (link == lastActiveSubmenu) {
  setMenuClassNames(2);
} else {
  setMenuClassNames(0);
}
} else if (
  $("#app-container").hasClass("menu-hidden") ||
  $("#app-container").hasClass("menu-mobile")
  ) {
  setMenuClassNames(0);
}
}
});

  function getActiveMainMenuLink() {
  var dataLink = $(".main-menu ul li.active a").attr("href");
  return dataLink.replace("#", "");
}

  function isClassIncludedApp(className) {
  var container = $("#app-container");
  var currentClasses = container
  .attr("class")
  .split(" ")
  .filter(x => x != "");
  return currentClasses.includes(className);
}

  var lastActiveSubmenu = "";
  function showSubMenu(dataLink) {
  if ($(".main-menu").length == 0) {
  return;
}

  var link = dataLink.replace("#", "");
  if ($(".sub-menu ul[data-link='" + link + "']").length == 0) {
  $("#app-container").removeClass("sub-show-temporary");

  if ($("#app-container").length == 0) {
  return;
}

  if (
  isClassIncludedApp("menu-sub-hidden") ||
  isClassIncludedApp("menu-hidden")
  ) {
  menuClickCount = 0;
} else {
  menuClickCount = 1;
}
  $("#app-container").addClass("sub-hidden");
  noTransition();
  return;
}
  if (link == lastActiveSubmenu) {
  return;
}
  $(".sub-menu ul").fadeOut(0);
  $(".sub-menu ul[data-link='" + link + "']").slideDown(100);

  $(".sub-menu .scroll").scrollTop(0);
  lastActiveSubmenu = link;
}

  function noTransition() {
  $(".sub-menu").addClass("no-transition");
  $("main").addClass("no-transition");
  setTimeout(function() {
  $(".sub-menu").removeClass("no-transition");
  $("main").removeClass("no-transition");
}, 350);
}

  showSubMenu($(".main-menu ul li.active a").attr("href"));

  function resizeCarousel() {
  setTimeout(function() {
  var event = document.createEvent("HTMLEvents");
  event.initEvent("resize", false, false);
  window.dispatchEvent(event);
}, 350);
}

  /* 03.06. App Menu */
  $(".app-menu-button").on("click", function() {
  event.preventDefault();
  if ($(".app-menu").hasClass("shown")) {
  $(".app-menu").removeClass("shown");
} else {
  $(".app-menu").addClass("shown");
}
});

  $(document).on("click", function(event) {
  if (
  !(
  $(event.target)
  .parents()
  .hasClass("app-menu") ||
  $(event.target)
  .parents()
  .hasClass("app-menu-button") ||
  $(event.target).hasClass("app-menu-button") ||
  $(event.target).hasClass("app-menu")
  )
  ) {
  if ($(".app-menu").hasClass("shown")) {
  $(".app-menu").removeClass("shown");
}
}
});

  /* 03.07. Survey App */
  $(document).on("click", ".question .view-button", function() {
  editViewClick($(this));
});

  $(document).on("click", ".question .edit-button", function() {
  editViewClick($(this));
});

  function editViewClick($this) {
  var $question = $($this.parents(".question"));
  $question.toggleClass("edit-quesiton");
  $question.toggleClass("view-quesiton");
  var $questionCollapse = $question.find(".question-collapse");
  if (!$questionCollapse.hasClass("show")) {
  $questionCollapse.collapse("toggle");
  $question.find(".rotate-icon-click").toggleClass("rotate");
}
}

  /* 03.08. Rotate Button */
  $(document).on("click", ".rotate-icon-click", function() {
  $(this).toggleClass("rotate");
});

  /* 03.09. Charts */
  if (typeof Chart !== "undefined") {
  Chart.defaults.global.defaultFontFamily = "'Nunito', sans-serif";

  Chart.defaults.LineWithShadow = Chart.defaults.line;
  Chart.controllers.LineWithShadow = Chart.controllers.line.extend({
  draw: function(ease) {
  Chart.controllers.line.prototype.draw.call(this, ease);
  var ctx = this.chart.ctx;
  ctx.save();
  ctx.shadowColor = "rgba(0,0,0,0.15)";
  ctx.shadowBlur = 10;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 10;
  ctx.responsive = true;
  ctx.stroke();
  Chart.controllers.line.prototype.draw.apply(this, arguments);
  ctx.restore();
}
});

  Chart.defaults.BarWithShadow = Chart.defaults.bar;
  Chart.controllers.BarWithShadow = Chart.controllers.bar.extend({
  draw: function(ease) {
  Chart.controllers.bar.prototype.draw.call(this, ease);
  var ctx = this.chart.ctx;
  ctx.save();
  ctx.shadowColor = "rgba(0,0,0,0.15)";
  ctx.shadowBlur = 12;
  ctx.shadowOffsetX = 5;
  ctx.shadowOffsetY = 10;
  ctx.responsive = true;
  Chart.controllers.bar.prototype.draw.apply(this, arguments);
  ctx.restore();
}
});

  Chart.defaults.LineWithLine = Chart.defaults.line;
  Chart.controllers.LineWithLine = Chart.controllers.line.extend({
  draw: function(ease) {
  Chart.controllers.line.prototype.draw.call(this, ease);

  if (this.chart.tooltip._active && this.chart.tooltip._active.length) {
  var activePoint = this.chart.tooltip._active[0];
  var ctx = this.chart.ctx;
  var x = activePoint.tooltipPosition().x;
  var topY = this.chart.scales["y-axis-0"].top;
  var bottomY = this.chart.scales["y-axis-0"].bottom;

  ctx.save();
  ctx.beginPath();
  ctx.moveTo(x, topY);
  ctx.lineTo(x, bottomY);
  ctx.lineWidth = 1;
  ctx.strokeStyle = "rgba(0,0,0,0.1)";
  ctx.stroke();
  ctx.restore();
}
}
});

  Chart.defaults.DoughnutWithShadow = Chart.defaults.doughnut;
  Chart.controllers.DoughnutWithShadow = Chart.controllers.doughnut.extend({
  draw: function(ease) {
  Chart.controllers.doughnut.prototype.draw.call(this, ease);
  let ctx = this.chart.chart.ctx;
  ctx.save();
  ctx.shadowColor = "rgba(0,0,0,0.15)";
  ctx.shadowBlur = 10;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 10;
  ctx.responsive = true;
  Chart.controllers.doughnut.prototype.draw.apply(this, arguments);
  ctx.restore();
}
});

  Chart.defaults.PieWithShadow = Chart.defaults.pie;
  Chart.controllers.PieWithShadow = Chart.controllers.pie.extend({
  draw: function(ease) {
  Chart.controllers.pie.prototype.draw.call(this, ease);
  let ctx = this.chart.chart.ctx;
  ctx.save();
  ctx.shadowColor = "rgba(0,0,0,0.15)";
  ctx.shadowBlur = 10;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 10;
  ctx.responsive = true;
  Chart.controllers.pie.prototype.draw.apply(this, arguments);
  ctx.restore();
}
});

  Chart.defaults.ScatterWithShadow = Chart.defaults.scatter;
  Chart.controllers.ScatterWithShadow = Chart.controllers.scatter.extend({
  draw: function(ease) {
  Chart.controllers.scatter.prototype.draw.call(this, ease);
  let ctx = this.chart.chart.ctx;
  ctx.save();
  ctx.shadowColor = "rgba(0,0,0,0.2)";
  ctx.shadowBlur = 7;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 7;
  ctx.responsive = true;
  Chart.controllers.scatter.prototype.draw.apply(this, arguments);
  ctx.restore();
}
});

  Chart.defaults.RadarWithShadow = Chart.defaults.radar;
  Chart.controllers.RadarWithShadow = Chart.controllers.radar.extend({
  draw: function(ease) {
  Chart.controllers.radar.prototype.draw.call(this, ease);
  let ctx = this.chart.chart.ctx;
  ctx.save();
  ctx.shadowColor = "rgba(0,0,0,0.2)";
  ctx.shadowBlur = 7;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 7;
  ctx.responsive = true;
  Chart.controllers.radar.prototype.draw.apply(this, arguments);
  ctx.restore();
}
});

  Chart.defaults.PolarWithShadow = Chart.defaults.polarArea;
  Chart.controllers.PolarWithShadow = Chart.controllers.polarArea.extend({
  draw: function(ease) {
  Chart.controllers.polarArea.prototype.draw.call(this, ease);
  let ctx = this.chart.chart.ctx;
  ctx.save();
  ctx.shadowColor = "rgba(0,0,0,0.2)";
  ctx.shadowBlur = 10;
  ctx.shadowOffsetX = 5;
  ctx.shadowOffsetY = 10;
  ctx.responsive = true;
  Chart.controllers.polarArea.prototype.draw.apply(this, arguments);
  ctx.restore();
}
});

  var chartTooltip = {
  backgroundColor: foregroundColor,
  titleFontColor: primaryColor,
  borderColor: separatorColor,
  borderWidth: 0.5,
  bodyFontColor: primaryColor,
  bodySpacing: 10,
  xPadding: 15,
  yPadding: 15,
  cornerRadius: 0.15,
  displayColors: false
};

  if (document.getElementById("visitChartFull")) {
  var visitChartFull = document
  .getElementById("visitChartFull")
  .getContext("2d");
  var myChart = new Chart(visitChartFull, {
  type: "LineWithShadow",
  data: {
  labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  datasets: [
{
  label: "Data",
  borderColor: themeColor1,
  pointBorderColor: themeColor1,
  pointBackgroundColor: themeColor1,
  pointHoverBackgroundColor: themeColor1,
  pointHoverBorderColor: themeColor1,
  pointRadius: 3,
  pointBorderWidth: 3,
  pointHoverRadius: 3,
  fill: true,
  backgroundColor: themeColor1_10,
  borderWidth: 2,
  data: [180, 140, 150, 120, 180, 110, 160],
  datalabels: {
  align: "end",
  anchor: "end"
}
}
  ]
},
  options: {
  layout: {
  padding: {
  left: 0,
  right: 0,
  top: 40,
  bottom: 0
}
},
  plugins: {
  datalabels: {
  backgroundColor: "transparent",
  borderRadius: 30,
  borderWidth: 1,
  padding: 5,
  borderColor: function(context) {
  return context.dataset.borderColor;
},
  color: function(context) {
  return context.dataset.borderColor;
},
  font: {
  weight: "bold",
  size: 10
},
  formatter: Math.round
}
},
  responsive: true,
  maintainAspectRatio: false,
  legend: {
  display: false
},
  tooltips: chartTooltip,
  scales: {
  yAxes: [
{
  ticks: {
  min: 0
},
  display: false
}
  ],
  xAxes: [
{
  ticks: {
  min: 0
},
  display: false
}
  ]
}
}
});
}

  if (document.getElementById("visitChart")) {
  var visitChart = document.getElementById("visitChart").getContext("2d");
  var myChart = new Chart(visitChart, {
  type: "LineWithShadow",
  options: {
  plugins: {
  datalabels: {
  display: false
}
},
  responsive: true,
  maintainAspectRatio: false,
  scales: {
  yAxes: [
{
  gridLines: {
  display: true,
  lineWidth: 1,
  color: "rgba(0,0,0,0.1)",
  drawBorder: false
},
  ticks: {
  beginAtZero: true,
  stepSize: 5,
  min: 50,
  max: 70,
  padding: 0
}
}
  ],
  xAxes: [
{
  gridLines: {
  display: false
}
}
  ]
},
  legend: {
  display: false
},
  tooltips: chartTooltip
},
  data: {
  labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  datasets: [
{
  label: "",
  data: [54, 63, 60, 65, 60, 68, 60],
  borderColor: themeColor1,
  pointBackgroundColor: foregroundColor,
  pointBorderColor: themeColor1,
  pointHoverBackgroundColor: themeColor1,
  pointHoverBorderColor: foregroundColor,
  pointRadius: 4,
  pointBorderWidth: 2,
  pointHoverRadius: 5,
  fill: true,
  borderWidth: 2,
  backgroundColor: themeColor1_10
}
  ]
}
});
}

  if (document.getElementById("conversionChart")) {
  var conversionChart = document
  .getElementById("conversionChart")
  .getContext("2d");
  var myChart = new Chart(conversionChart, {
  type: "LineWithShadow",
  options: {
  plugins: {
  datalabels: {
  display: false
}
},
  responsive: true,
  maintainAspectRatio: false,
  scales: {
  yAxes: [
{
  gridLines: {
  display: true,
  lineWidth: 1,
  color: "rgba(0,0,0,0.1)",
  drawBorder: false
},
  ticks: {
  beginAtZero: true,
  stepSize: 5,
  min: 50,
  max: 70,
  padding: 0
}
}
  ],
  xAxes: [
{
  gridLines: {
  display: false
}
}
  ]
},
  legend: {
  display: false
},
  tooltips: chartTooltip
},
  data: {
  labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  datasets: [
{
  label: "",
  data: [65, 60, 68, 54, 63, 60, 60],
  borderColor: themeColor2,
  pointBackgroundColor: foregroundColor,
  pointBorderColor: themeColor2,
  pointHoverBackgroundColor: themeColor2,
  pointHoverBorderColor: foregroundColor,
  pointRadius: 4,
  pointBorderWidth: 2,
  pointHoverRadius: 5,
  fill: true,
  borderWidth: 2,
  backgroundColor: themeColor2_10
}
  ]
}
});
}

  var smallChartOptions = {
  layout: {
  padding: {
  left: 5,
  right: 5,
  top: 10,
  bottom: 10
}
},
  plugins: {
  datalabels: {
  display: false
}
},
  responsive: true,
  maintainAspectRatio: false,
  legend: {
  display: false
},
  tooltips: {
  intersect: false,
  enabled: false,
  custom: function(tooltipModel) {
  if (tooltipModel && tooltipModel.dataPoints) {
  var $textContainer = $(this._chart.canvas.offsetParent);
  var yLabel = tooltipModel.dataPoints[0].yLabel;
  var xLabel = tooltipModel.dataPoints[0].xLabel;
  var label = tooltipModel.body[0].lines[0].split(":")[0];
  $textContainer.find(".value").html("$" + $.fn.addCommas(yLabel));
  $textContainer.find(".label").html(label + "-" + xLabel);
}
}
},
  scales: {
  yAxes: [
{
  ticks: {
  beginAtZero: true
},
  display: false
}
  ],
  xAxes: [
{
  display: false
}
  ]
}
};

  var smallChartInit = {
  afterInit: function(chart, options) {
  var $textContainer = $(chart.canvas.offsetParent);
  var yLabel = chart.data.datasets[0].data[0];
  var xLabel = chart.data.labels[0];
  var label = chart.data.datasets[0].label;
  $textContainer.find(".value").html("$" + $.fn.addCommas(yLabel));
  $textContainer.find(".label").html(label + "-" + xLabel);
}
};

  if (document.getElementById("smallChart1")) {
  var smallChart1 = document
  .getElementById("smallChart1")
  .getContext("2d");
  var myChart = new Chart(smallChart1, {
  type: "LineWithLine",
  plugins: [smallChartInit],
  data: {
  labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  datasets: [
{
  label: "Total Orders",
  borderColor: themeColor1,
  pointBorderColor: themeColor1,
  pointHoverBackgroundColor: themeColor1,
  pointHoverBorderColor: themeColor1,
  pointRadius: 2,
  pointBorderWidth: 3,
  pointHoverRadius: 2,
  fill: false,
  borderWidth: 2,
  data: [1250, 1300, 1550, 921, 1810, 1106, 1610],
  datalabels: {
  align: "end",
  anchor: "end"
}
}
  ]
},
  options: smallChartOptions
});
}

  if (document.getElementById("smallChart2")) {
  var smallChart1 = document
  .getElementById("smallChart2")
  .getContext("2d");
  var myChart = new Chart(smallChart1, {
  type: "LineWithLine",
  plugins: [smallChartInit],
  data: {
  labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  datasets: [
{
  label: "Pending Orders",
  borderColor: themeColor1,
  pointBorderColor: themeColor1,
  pointHoverBackgroundColor: themeColor1,
  pointHoverBorderColor: themeColor1,
  pointRadius: 2,
  pointBorderWidth: 3,
  pointHoverRadius: 2,
  fill: false,
  borderWidth: 2,
  data: [115, 120, 300, 222, 105, 85, 36],
  datalabels: {
  align: "end",
  anchor: "end"
}
}
  ]
},
  options: smallChartOptions
});
}

  if (document.getElementById("smallChart3")) {
  var smallChart1 = document
  .getElementById("smallChart3")
  .getContext("2d");
  var myChart = new Chart(smallChart1, {
  type: "LineWithLine",
  plugins: [smallChartInit],
  data: {
  labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  datasets: [
{
  label: "Active Orders",
  borderColor: themeColor1,
  pointBorderColor: themeColor1,
  pointHoverBackgroundColor: themeColor1,
  pointHoverBorderColor: themeColor1,
  pointRadius: 2,
  pointBorderWidth: 3,
  pointHoverRadius: 2,
  fill: false,
  borderWidth: 2,
  data: [350, 452, 762, 952, 630, 85, 158],
  datalabels: {
  align: "end",
  anchor: "end"
}
}
  ]
},
  options: smallChartOptions
});
}

  if (document.getElementById("smallChart4")) {
  var smallChart1 = document
  .getElementById("smallChart4")
  .getContext("2d");
  var myChart = new Chart(smallChart1, {
  type: "LineWithLine",
  plugins: [smallChartInit],
  data: {
  labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  datasets: [
{
  label: "Shipped Orders",
  borderColor: themeColor1,
  pointBorderColor: themeColor1,
  pointHoverBackgroundColor: themeColor1,
  pointHoverBorderColor: themeColor1,
  pointRadius: 2,
  pointBorderWidth: 3,
  pointHoverRadius: 2,
  fill: false,
  borderWidth: 2,
  data: [200, 452, 250, 630, 125, 85, 20],
  datalabels: {
  align: "end",
  anchor: "end"
}
}
  ]
},
  options: smallChartOptions
});
}

  if (document.getElementById("salesChart")) {
  var salesChart = document.getElementById("salesChart").getContext("2d");
  var myChart = new Chart(salesChart, {
  type: "LineWithShadow",
  options: {
  plugins: {
  datalabels: {
  display: false
}
},
  responsive: true,
  maintainAspectRatio: false,
  scales: {
  yAxes: [
{
  gridLines: {
  display: true,
  lineWidth: 1,
  color: "rgba(0,0,0,0.1)",
  drawBorder: false
},
  ticks: {
  beginAtZero: true,
  stepSize: 5,
  min: 50,
  max: 70,
  padding: 20
}
}
  ],
  xAxes: [
{
  gridLines: {
  display: false
}
}
  ]
},
  legend: {
  display: false
},
  tooltips: chartTooltip
},
  data: {
  labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  datasets: [
{
  label: "",
  data: [54, 63, 60, 65, 60, 68, 60],
  borderColor: themeColor1,
  pointBackgroundColor: foregroundColor,
  pointBorderColor: themeColor1,
  pointHoverBackgroundColor: themeColor1,
  pointHoverBorderColor: foregroundColor,
  pointRadius: 6,
  pointBorderWidth: 2,
  pointHoverRadius: 8,
  fill: false
}
  ]
}
});
}

  if (document.getElementById("areaChart")) {
  var areaChart = document.getElementById("areaChart").getContext("2d");
  var myChart = new Chart(areaChart, {
  type: "LineWithShadow",
  options: {
  plugins: {
  datalabels: {
  display: false
}
},
  responsive: true,
  maintainAspectRatio: false,
  scales: {
  yAxes: [
{
  gridLines: {
  display: true,
  lineWidth: 1,
  color: "rgba(0,0,0,0.1)",
  drawBorder: false
},
  ticks: {
  beginAtZero: true,
  stepSize: 5,
  min: 50,
  max: 70,
  padding: 0
}
}
  ],
  xAxes: [
{
  gridLines: {
  display: false
}
}
  ]
},
  legend: {
  display: false
},
  tooltips: chartTooltip
},
  data: {
  labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  datasets: [
{
  label: "",
  data: [54, 63, 60, 65, 60, 68, 60],
  borderColor: themeColor1,
  pointBackgroundColor: foregroundColor,
  pointBorderColor: themeColor1,
  pointHoverBackgroundColor: themeColor1,
  pointHoverBorderColor: foregroundColor,
  pointRadius: 4,
  pointBorderWidth: 2,
  pointHoverRadius: 5,
  fill: true,
  borderWidth: 2,
  backgroundColor: themeColor1_10
}
  ]
}
});
}

  if (document.getElementById("areaChartNoShadow")) {
  var areaChartNoShadow = document
  .getElementById("areaChartNoShadow")
  .getContext("2d");
  var myChart = new Chart(areaChartNoShadow, {
  type: "line",
  options: {
  plugins: {
  datalabels: {
  display: false
}
},
  responsive: true,
  maintainAspectRatio: false,
  scales: {
  yAxes: [
{
  gridLines: {
  display: true,
  lineWidth: 1,
  color: "rgba(0,0,0,0.1)",
  drawBorder: false
},
  ticks: {
  beginAtZero: true,
  stepSize: 5,
  min: 50,
  max: 70,
  padding: 0
}
}
  ],
  xAxes: [
{
  gridLines: {
  display: false
}
}
  ]
},
  legend: {
  display: false
},
  tooltips: chartTooltip
},
  data: {
  labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  datasets: [
{
  label: "",
  data: [54, 63, 60, 65, 60, 68, 60],
  borderColor: themeColor1,
  pointBackgroundColor: foregroundColor,
  pointBorderColor: themeColor1,
  pointHoverBackgroundColor: themeColor1,
  pointHoverBorderColor: foregroundColor,
  pointRadius: 4,
  pointBorderWidth: 2,
  pointHoverRadius: 5,
  fill: true,
  borderWidth: 2,
  backgroundColor: themeColor1_10
}
  ]
}
});
}

  if (document.getElementById("scatterChart")) {
  var scatterChart = document
  .getElementById("scatterChart")
  .getContext("2d");
  var myChart = new Chart(scatterChart, {
  type: "ScatterWithShadow",
  options: {
  plugins: {
  datalabels: {
  display: false
}
},
  responsive: true,
  maintainAspectRatio: false,
  scales: {
  yAxes: [
{
  gridLines: {
  display: true,
  lineWidth: 1,
  color: "rgba(0,0,0,0.1)",
  drawBorder: false
},
  ticks: {
  beginAtZero: true,
  stepSize: 20,
  min: -80,
  max: 80,
  padding: 20
}
}
  ],
  xAxes: [
{
  gridLines: {
  display: true,
  lineWidth: 1,
  color: "rgba(0,0,0,0.1)"
}
}
  ]
},
  legend: {
  position: "bottom",
  labels: {
  padding: 30,
  usePointStyle: true,
  fontSize: 12
}
},
  tooltips: chartTooltip
},
  data: {
  datasets: [
{
  borderWidth: 2,
  label: "Cakes",
  borderColor: themeColor1,
  backgroundColor: themeColor1_10,
  data: [
{ x: 62, y: -78 },
{ x: -0, y: 74 },
{ x: -67, y: 45 },
{ x: -26, y: -43 },
{ x: -15, y: -30 },
{ x: 65, y: -68 },
{ x: -28, y: -61 }
  ]
},
{
  borderWidth: 2,
  label: "Desserts",
  borderColor: themeColor2,
  backgroundColor: themeColor2_10,
  data: [
{ x: 79, y: 62 },
{ x: 62, y: 0 },
{ x: -76, y: -81 },
{ x: -51, y: 41 },
{ x: -9, y: 9 },
{ x: 72, y: -37 },
{ x: 62, y: -26 }
  ]
}
  ]
}
});
}

  if (document.getElementById("scatterChartNoShadow")) {
  var scatterChartNoShadow = document
  .getElementById("scatterChartNoShadow")
  .getContext("2d");
  var myChart = new Chart(scatterChartNoShadow, {
  type: "scatter",
  options: {
  plugins: {
  datalabels: {
  display: false
}
},
  responsive: true,
  maintainAspectRatio: false,
  scales: {
  yAxes: [
{
  gridLines: {
  display: true,
  lineWidth: 1,
  color: "rgba(0,0,0,0.1)",
  drawBorder: false
},
  ticks: {
  beginAtZero: true,
  stepSize: 20,
  min: -80,
  max: 80,
  padding: 20
}
}
  ],
  xAxes: [
{
  gridLines: {
  display: true,
  lineWidth: 1,
  color: "rgba(0,0,0,0.1)"
}
}
  ]
},
  legend: {
  position: "bottom",
  labels: {
  padding: 30,
  usePointStyle: true,
  fontSize: 12
}
},
  tooltips: chartTooltip
},
  data: {
  datasets: [
{
  borderWidth: 2,
  label: "Cakes",
  borderColor: themeColor1,
  backgroundColor: themeColor1_10,
  data: [
{ x: 62, y: -78 },
{ x: -0, y: 74 },
{ x: -67, y: 45 },
{ x: -26, y: -43 },
{ x: -15, y: -30 },
{ x: 65, y: -68 },
{ x: -28, y: -61 }
  ]
},
{
  borderWidth: 2,
  label: "Desserts",
  borderColor: themeColor2,
  backgroundColor: themeColor2_10,
  data: [
{ x: 79, y: 62 },
{ x: 62, y: 0 },
{ x: -76, y: -81 },
{ x: -51, y: 41 },
{ x: -9, y: 9 },
{ x: 72, y: -37 },
{ x: 62, y: -26 }
  ]
}
  ]
}
});
}

  if (document.getElementById("radarChartNoShadow")) {
  var radarChartNoShadow = document
  .getElementById("radarChartNoShadow")
  .getContext("2d");
  var myChart = new Chart(radarChartNoShadow, {
  type: "radar",
  options: {
  plugins: {
  datalabels: {
  display: false
}
},
  responsive: true,
  maintainAspectRatio: false,
  scale: {
  ticks: {
  display: false
}
},
  legend: {
  position: "bottom",
  labels: {
  padding: 30,
  usePointStyle: true,
  fontSize: 12
}
},
  tooltips: chartTooltip
},
  data: {
  datasets: [
{
  label: "Stock",
  borderWidth: 2,
  pointBackgroundColor: themeColor1,
  borderColor: themeColor1,
  backgroundColor: themeColor1_10,
  data: [80, 90, 70]
},
{
  label: "Order",
  borderWidth: 2,
  pointBackgroundColor: themeColor2,
  borderColor: themeColor2,
  backgroundColor: themeColor2_10,
  data: [68, 80, 95]
}
  ],
  labels: ["Cakes", "Desserts", "Cupcakes"]
}
});
}

  if (document.getElementById("radarChart")) {
  var radarChart = document.getElementById("radarChart").getContext("2d");
  var myChart = new Chart(radarChart, {
  type: "RadarWithShadow",
  options: {
  plugins: {
  datalabels: {
  display: false
}
},
  responsive: true,
  maintainAspectRatio: false,
  scale: {
  ticks: {
  display: false
}
},
  legend: {
  position: "bottom",
  labels: {
  padding: 30,
  usePointStyle: true,
  fontSize: 12
}
},
  tooltips: chartTooltip
},
  data: {
  datasets: [
{
  label: "Stock",
  borderWidth: 2,
  pointBackgroundColor: themeColor1,
  borderColor: themeColor1,
  backgroundColor: themeColor1_10,
  data: [80, 90, 70]
},
{
  label: "Order",
  borderWidth: 2,
  pointBackgroundColor: themeColor2,
  borderColor: themeColor2,
  backgroundColor: themeColor2_10,
  data: [68, 80, 95]
}
  ],
  labels: ["Cakes", "Desserts", "Cupcakes"]
}
});
}

  if (document.getElementById("polarChartNoShadow")) {
  var polarChartNoShadow = document
  .getElementById("polarChartNoShadow")
  .getContext("2d");
  var myChart = new Chart(polarChartNoShadow, {
  type: "polarArea",
  options: {
  plugins: {
  datalabels: {
  display: false
}
},
  responsive: true,
  maintainAspectRatio: false,
  scale: {
  ticks: {
  display: false
}
},
  legend: {
  position: "bottom",
  labels: {
  padding: 30,
  usePointStyle: true,
  fontSize: 12
}
},
  tooltips: chartTooltip
},
  data: {
  datasets: [
{
  label: "Stock",
  borderWidth: 2,
  pointBackgroundColor: themeColor1,
  borderColor: [themeColor1, themeColor2, themeColor3],
  backgroundColor: [
  themeColor1_10,
  themeColor2_10,
  themeColor3_10
  ],
  data: [80, 90, 70]
}
  ],
  labels: ["Cakes", "Desserts", "Cupcakes"]
}
});
}

  if (document.getElementById("salesChartNoShadow")) {
  var salesChartNoShadow = document
  .getElementById("salesChartNoShadow")
  .getContext("2d");
  var myChart = new Chart(salesChartNoShadow, {
  type: "line",
  options: {
  plugins: {
  datalabels: {
  display: false
}
},
  responsive: true,
  maintainAspectRatio: false,
  scales: {
  yAxes: [
{
  gridLines: {
  display: true,
  lineWidth: 1,
  color: "rgba(0,0,0,0.1)",
  drawBorder: false
},
  ticks: {
  beginAtZero: true,
  stepSize: 5,
  min: 50,
  max: 70,
  padding: 20
}
}
  ],
  xAxes: [
{
  gridLines: {
  display: false
}
}
  ]
},
  legend: {
  display: false
},
  tooltips: chartTooltip
},
  data: {
  labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  datasets: [
{
  label: "",
  data: [54, 63, 60, 65, 60, 68, 60],
  borderColor: themeColor1,
  pointBackgroundColor: foregroundColor,
  pointBorderColor: themeColor1,
  pointHoverBackgroundColor: themeColor1,
  pointHoverBorderColor: foregroundColor,
  pointRadius: 6,
  pointBorderWidth: 2,
  pointHoverRadius: 8,
  fill: false
}
  ]
}
});
}

  if (document.getElementById("productChart")) {
  var productChart = document
  .getElementById("productChart")
  .getContext("2d");
  var myChart = new Chart(productChart, {
  type: "BarWithShadow",
  options: {
  plugins: {
  datalabels: {
  display: false
}
},
  responsive: true,
  maintainAspectRatio: false,
  scales: {
  yAxes: [
{
  gridLines: {
  display: true,
  lineWidth: 1,
  color: "rgba(0,0,0,0.1)",
  drawBorder: false
},
  ticks: {
  beginAtZero: true,
  stepSize: 100,
  min: 300,
  max: 800,
  padding: 20
}
}
  ],
  xAxes: [
{
  gridLines: {
  display: false
}
}
  ]
},
  legend: {
  position: "bottom",
  labels: {
  padding: 30,
  usePointStyle: true,
  fontSize: 12
}
},
  tooltips: chartTooltip
},
  data: {
  labels: ["January", "February", "March", "April", "May", "June"],
  datasets: [
{
  label: "Cakes",
  borderColor: themeColor1,
  backgroundColor: themeColor1_10,
  data: [456, 479, 324, 569, 702, 600],
  borderWidth: 2
},
{
  label: "Desserts",
  borderColor: themeColor2,
  backgroundColor: themeColor2_10,
  data: [364, 504, 605, 400, 345, 320],
  borderWidth: 2
}
  ]
}
});
}

  if (document.getElementById("productChartNoShadow")) {
  var productChartNoShadow = document
  .getElementById("productChartNoShadow")
  .getContext("2d");
  var myChart = new Chart(productChartNoShadow, {
  type: "bar",
  options: {
  plugins: {
  datalabels: {
  display: false
}
},
  responsive: true,
  maintainAspectRatio: false,
  scales: {
  yAxes: [
{
  gridLines: {
  display: true,
  lineWidth: 1,
  color: "rgba(0,0,0,0.1)",
  drawBorder: false
},
  ticks: {
  beginAtZero: true,
  stepSize: 100,
  min: 300,
  max: 800,
  padding: 20
}
}
  ],
  xAxes: [
{
  gridLines: {
  display: false
}
}
  ]
},
  legend: {
  position: "bottom",
  labels: {
  padding: 30,
  usePointStyle: true,
  fontSize: 12
}
},
  tooltips: chartTooltip
},
  data: {
  labels: ["January", "February", "March", "April", "May", "June"],
  datasets: [
{
  label: "Cakes",
  borderColor: themeColor1,
  backgroundColor: themeColor1_10,
  data: [456, 479, 324, 569, 702, 600],
  borderWidth: 2
},
{
  label: "Desserts",
  borderColor: themeColor2,
  backgroundColor: themeColor2_10,
  data: [364, 504, 605, 400, 345, 320],
  borderWidth: 2
}
  ]
}
});
}

  var contributionChartOptions = {
  type: "LineWithShadow",
  options: {
  plugins: {
  datalabels: {
  display: false
}
},
  responsive: true,
  maintainAspectRatio: false,
  scales: {
  yAxes: [
{
  gridLines: {
  display: true,
  lineWidth: 1,
  color: "rgba(0,0,0,0.1)",
  drawBorder: false
},
  ticks: {
  beginAtZero: true,
  stepSize: 5,
  min: 50,
  max: 70,
  padding: 20
}
}
  ],
  xAxes: [
{
  gridLines: {
  display: false
}
}
  ]
},
  legend: {
  display: false
},
  tooltips: chartTooltip
},
  data: {
  labels: [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec"
  ],
  datasets: [
{
  borderWidth: 2,
  label: "",
  data: [54, 63, 60, 65, 60, 68, 60, 63, 60, 65, 60, 68],
  borderColor: themeColor1,
  pointBackgroundColor: foregroundColor,
  pointBorderColor: themeColor1,
  pointHoverBackgroundColor: themeColor1,
  pointHoverBorderColor: foregroundColor,
  pointRadius: 4,
  pointBorderWidth: 2,
  pointHoverRadius: 5,
  fill: false
}
  ]
}
};

  if (document.getElementById("contributionChart1")) {
  var contributionChart1 = new Chart(
  document.getElementById("contributionChart1").getContext("2d"),
  contributionChartOptions
  );
}

  if (document.getElementById("contributionChart2")) {
  var contributionChart2 = new Chart(
  document.getElementById("contributionChart2").getContext("2d"),
  contributionChartOptions
  );
}

  if (document.getElementById("contributionChart3")) {
  var contributionChart3 = new Chart(
  document.getElementById("contributionChart3").getContext("2d"),
  contributionChartOptions
  );
}

  var centerTextPlugin = {
  afterDatasetsUpdate: function(chart) {},
  beforeDraw: function(chart) {
  var width = chart.chartArea.right;
  var height = chart.chartArea.bottom;
  var ctx = chart.chart.ctx;
  ctx.restore();

  var activeLabel = chart.data.labels[0];
  var activeValue = chart.data.datasets[0].data[0];
  var dataset = chart.data.datasets[0];
  var meta = dataset._meta[Object.keys(dataset._meta)[0]];
  var total = meta.total;

  var activePercentage = parseFloat(
  ((activeValue / total) * 100).toFixed(1)
  );
  activePercentage = chart.legend.legendItems[0].hidden
  ? 0
  : activePercentage;

  if (chart.pointAvailable) {
  activeLabel = chart.data.labels[chart.pointIndex];
  activeValue =
  chart.data.datasets[chart.pointDataIndex].data[chart.pointIndex];

  dataset = chart.data.datasets[chart.pointDataIndex];
  meta = dataset._meta[Object.keys(dataset._meta)[0]];
  total = meta.total;
  activePercentage = parseFloat(
  ((activeValue / total) * 100).toFixed(1)
  );
  activePercentage = chart.legend.legendItems[chart.pointIndex].hidden
  ? 0
  : activePercentage;
}

  ctx.font = "36px" + " Nunito, sans-serif";
  ctx.fillStyle = primaryColor;
  ctx.textBaseline = "middle";

  var text = activePercentage + "%",
  textX = Math.round((width - ctx.measureText(text).width) / 2),
  textY = height / 2;
  ctx.fillText(text, textX, textY);

  ctx.font = "14px" + " Nunito, sans-serif";
  ctx.textBaseline = "middle";

  var text2 = activeLabel,
  textX = Math.round((width - ctx.measureText(text2).width) / 2),
  textY = height / 2 - 30;
  ctx.fillText(text2, textX, textY);

  ctx.save();
},
  beforeEvent: function(chart, event, options) {
  var firstPoint = chart.getElementAtEvent(event)[0];

  if (firstPoint) {
  chart.pointIndex = firstPoint._index;
  chart.pointDataIndex = firstPoint._datasetIndex;
  chart.pointAvailable = true;
}
}
};

  if (document.getElementById("categoryChart")) {
  var categoryChart = document.getElementById("categoryChart");
  var myDoughnutChart = new Chart(categoryChart, {
  plugins: [centerTextPlugin],
  type: "DoughnutWithShadow",
  data: {
  labels: ["Cakes", "Cupcakes", "Desserts"],
  datasets: [
{
  label: "",
  borderColor: [themeColor3, themeColor2, themeColor1],
  backgroundColor: [
  themeColor3_10,
  themeColor2_10,
  themeColor1_10
  ],
  borderWidth: 2,
  data: [15, 25, 20]
}
  ]
},
  draw: function() {},
  options: {
  plugins: {
  datalabels: {
  display: false
}
},
  responsive: true,
  maintainAspectRatio: false,
  cutoutPercentage: 80,
  title: {
  display: false
},
  layout: {
  padding: {
  bottom: 20
}
},
  legend: {
  position: "bottom",
  labels: {
  padding: 30,
  usePointStyle: true,
  fontSize: 12
}
},
  tooltips: chartTooltip
}
});
}

  if (document.getElementById("categoryChartNoShadow")) {
  var categoryChartNoShadow = document.getElementById(
  "categoryChartNoShadow"
  );
  var myDoughnutChart = new Chart(categoryChartNoShadow, {
  plugins: [centerTextPlugin],
  type: "doughnut",
  data: {
  labels: ["Cakes", "Cupcakes", "Desserts"],
  datasets: [
{
  label: "",
  borderColor: [themeColor3, themeColor2, themeColor1],
  backgroundColor: [
  themeColor3_10,
  themeColor2_10,
  themeColor1_10
  ],
  borderWidth: 2,
  data: [15, 25, 20]
}
  ]
},
  draw: function() {},
  options: {
  plugins: {
  datalabels: {
  display: false
}
},
  responsive: true,
  maintainAspectRatio: false,
  cutoutPercentage: 80,
  title: {
  display: false
},
  layout: {
  padding: {
  bottom: 20
}
},
  legend: {
  position: "bottom",
  labels: {
  padding: 30,
  usePointStyle: true,
  fontSize: 12
}
},
  tooltips: chartTooltip
}
});
}

  if (document.getElementById("pieChartNoShadow")) {
  var pieChart = document.getElementById("pieChartNoShadow");
  var myChart = new Chart(pieChart, {
  type: "pie",
  data: {
  labels: ["Cakes", "Cupcakes", "Desserts"],
  datasets: [
{
  label: "",
  borderColor: [themeColor1, themeColor2, themeColor3],
  backgroundColor: [
  themeColor1_10,
  themeColor2_10,
  themeColor3_10
  ],
  borderWidth: 2,
  data: [15, 25, 20]
}
  ]
},
  draw: function() {},
  options: {
  plugins: {
  datalabels: {
  display: false
}
},
  responsive: true,
  maintainAspectRatio: false,
  title: {
  display: false
},
  layout: {
  padding: {
  bottom: 20
}
},
  legend: {
  position: "bottom",
  labels: {
  padding: 30,
  usePointStyle: true,
  fontSize: 12
}
},
  tooltips: chartTooltip
}
});
}

  if (document.getElementById("pieChart")) {
  var pieChart = document.getElementById("pieChart");
  var myChart = new Chart(pieChart, {
  type: "PieWithShadow",
  data: {
  labels: ["Cakes", "Cupcakes", "Desserts"],
  datasets: [
{
  label: "",
  borderColor: [themeColor1, themeColor2, themeColor3],
  backgroundColor: [
  themeColor1_10,
  themeColor2_10,
  themeColor3_10
  ],
  borderWidth: 2,
  data: [15, 25, 20]
}
  ]
},
  draw: function() {},
  options: {
  plugins: {
  datalabels: {
  display: false
}
},
  responsive: true,
  maintainAspectRatio: false,
  title: {
  display: false
},
  layout: {
  padding: {
  bottom: 20
}
},
  legend: {
  position: "bottom",
  labels: {
  padding: 30,
  usePointStyle: true,
  fontSize: 12
}
},
  tooltips: chartTooltip
}
});
}

  if (document.getElementById("frequencyChart")) {
  var frequencyChart = document.getElementById("frequencyChart");
  var myDoughnutChart = new Chart(frequencyChart, {
  plugins: [centerTextPlugin],
  type: "DoughnutWithShadow",
  data: {
  labels: ["Adding", "Editing", "Deleting"],
  datasets: [
{
  label: "",
  borderColor: [themeColor1, themeColor2, themeColor3],
  backgroundColor: [
  themeColor1_10,
  themeColor2_10,
  themeColor3_10
  ],
  borderWidth: 2,
  data: [15, 25, 20]
}
  ]
},
  draw: function() {},
  options: {
  plugins: {
  datalabels: {
  display: false
}
},
  responsive: true,
  maintainAspectRatio: false,
  cutoutPercentage: 80,
  title: {
  display: false
},
  layout: {
  padding: {
  bottom: 20
}
},
  legend: {
  position: "bottom",
  labels: {
  padding: 30,
  usePointStyle: true,
  fontSize: 12
}
},
  tooltips: chartTooltip
}
});
}

  if (document.getElementById("ageChart")) {
  var ageChart = document.getElementById("ageChart");
  var myDoughnutChart = new Chart(ageChart, {
  plugins: [centerTextPlugin],
  type: "DoughnutWithShadow",
  data: {
  labels: ["12-24", "24-30", "30-40", "40-50", "50-60"],
  datasets: [
{
  label: "",
  borderColor: [
  themeColor1,
  themeColor2,
  themeColor3,
  themeColor4,
  themeColor5
  ],
  backgroundColor: [
  themeColor1_10,
  themeColor2_10,
  themeColor3_10,
  themeColor4_10,
  themeColor5_10
  ],
  borderWidth: 2,
  data: [15, 25, 20, 30, 14]
}
  ]
},
  draw: function() {},
  options: {
  plugins: {
  datalabels: {
  display: false
}
},
  responsive: true,
  maintainAspectRatio: false,
  cutoutPercentage: 80,
  title: {
  display: false
},
  layout: {
  padding: {
  bottom: 20
}
},
  legend: {
  position: "bottom",
  labels: {
  padding: 30,
  usePointStyle: true,
  fontSize: 12
}
},
  tooltips: chartTooltip
}
});
}

  if (document.getElementById("genderChart")) {
  var genderChart = document.getElementById("genderChart");
  var myDoughnutChart = new Chart(genderChart, {
  plugins: [centerTextPlugin],
  type: "DoughnutWithShadow",
  data: {
  labels: ["Male", "Female", "Other"],
  datasets: [
{
  label: "",
  borderColor: [themeColor1, themeColor2, themeColor3],
  backgroundColor: [
  themeColor1_10,
  themeColor2_10,
  themeColor3_10
  ],
  borderWidth: 2,
  data: [85, 45, 20]
}
  ]
},
  draw: function() {},
  options: {
  plugins: {
  datalabels: {
  display: false
}
},
  responsive: true,
  maintainAspectRatio: false,
  cutoutPercentage: 80,
  title: {
  display: false
},
  layout: {
  padding: {
  bottom: 20
}
},
  legend: {
  position: "bottom",
  labels: {
  padding: 30,
  usePointStyle: true,
  fontSize: 12
}
},
  tooltips: chartTooltip
}
});
}

  if (document.getElementById("workChart")) {
  var workChart = document.getElementById("workChart");
  var myDoughnutChart = new Chart(workChart, {
  plugins: [centerTextPlugin],
  type: "DoughnutWithShadow",
  data: {
  labels: [
  "Employed for wages",
  "Self-employed",
  "Looking for work",
  "Retired"
  ],
  datasets: [
{
  label: "",
  borderColor: [
  themeColor1,
  themeColor2,
  themeColor3,
  themeColor4
  ],
  backgroundColor: [
  themeColor1_10,
  themeColor2_10,
  themeColor3_10,
  themeColor4_10
  ],
  borderWidth: 2,
  data: [15, 25, 20, 8]
}
  ]
},
  draw: function() {},
  options: {
  plugins: {
  datalabels: {
  display: false
}
},
  responsive: true,
  maintainAspectRatio: false,
  cutoutPercentage: 80,
  title: {
  display: false
},
  layout: {
  padding: {
  bottom: 20
}
},
  legend: {
  position: "bottom",
  labels: {
  padding: 30,
  usePointStyle: true,
  fontSize: 12
}
},
  tooltips: chartTooltip
}
});
}

  if (document.getElementById("codingChart")) {
  var codingChart = document.getElementById("codingChart");
  var myDoughnutChart = new Chart(codingChart, {
  plugins: [centerTextPlugin],
  type: "DoughnutWithShadow",
  data: {
  labels: ["Python", "JavaScript", "PHP", "Java", "C#"],
  datasets: [
{
  label: "",
  borderColor: [
  themeColor1,
  themeColor2,
  themeColor3,
  themeColor4,
  themeColor5
  ],
  backgroundColor: [
  themeColor1_10,
  themeColor2_10,
  themeColor3_10,
  themeColor4_10,
  themeColor5_10
  ],
  borderWidth: 2,
  data: [15, 25, 20, 8, 25]
}
  ]
},
  draw: function() {},
  options: {
  plugins: {
  datalabels: {
  display: false
}
},
  responsive: true,
  maintainAspectRatio: false,
  cutoutPercentage: 80,
  title: {
  display: false
},
  layout: {
  padding: {
  bottom: 20
}
},
  legend: {
  position: "bottom",
  labels: {
  padding: 30,
  usePointStyle: true,
  fontSize: 12
}
},
  tooltips: chartTooltip
}
});
}
}

  /* 03.10. Calendar */
  if ($().fullCalendar) {
  var testEvent = new Date(new Date().setHours(new Date().getHours()));
  var day = testEvent.getDate();
  var month = testEvent.getMonth() + 1;
  $(".calendar").fullCalendar({
  themeSystem: "bootstrap4",
  height: "auto",
  buttonText: {
  today: "Today",
  month: "Month",
  week: "Week",
  day: "Day",
  list: "List"
},
  bootstrapFontAwesome: {
  prev: " simple-icon-arrow-left",
  next: " simple-icon-arrow-right",
  prevYear: "simple-icon-control-start",
  nextYear: "simple-icon-control-end"
},
  events: [
{
  title: "Account",
  start: "2018-05-18"
},
{
  title: "Delivery",
  start: "2018-09-22",
  end: "2018-09-24"
},
{
  title: "Conference",
  start: "2018-06-07",
  end: "2018-06-09"
},
{
  title: "Delivery",
  start: "2018-11-03",
  end: "2018-11-06"
},
{
  title: "Meeting",
  start: "2018-10-07",
  end: "2018-10-09"
},
{
  title: "Taxes",
  start: "2018-08-07",
  end: "2018-08-09"
}
  ]
});
}

  /* 03.11. Datatable */
  if ($().DataTable) {
  $(".data-table").DataTable({
  searching: false,
  bLengthChange: false,
  destroy: true,
  info: false,
  sDom:
  '<"row view-filter"<"col-sm-12"<"pull-left"l><"pull-right"f><"clearfix">>>t<"row view-pager"<"col-sm-12"<"text-center"ip>>>',
  pageLength: 6,
  language: {
  paginate: {
  previous: "<i class='simple-icon-arrow-left'></i>",
  next: "<i class='simple-icon-arrow-right'></i>"
}
},

  drawCallback: function() {
  $($(".dataTables_wrapper .pagination li:first-of-type"))
  .find("a")
  .addClass("prev");
  $($(".dataTables_wrapper .pagination li:last-of-type"))
  .find("a")
  .addClass("next");

  $(".dataTables_wrapper .pagination").addClass("pagination-sm");
}
});
}

  /* 03.12. Notification */
  function showNotification(placementFrom, placementAlign, type) {
  $.notify(
{
  title: "Bootstrap Notify",
  message: "Here is a notification!",
  target: "_blank"
},
{
  element: "body",
  position: null,
  type: type,
  allow_dismiss: true,
  newest_on_top: false,
  showProgressbar: false,
  placement: {
  from: placementFrom,
  align: placementAlign
},
  offset: 20,
  spacing: 10,
  z_index: 1031,
  delay: 4000,
  timer: 2000,
  url_target: "_blank",
  mouse_over: null,
  animate: {
  enter: "animated fadeInDown",
  exit: "animated fadeOutUp"
},
  onShow: null,
  onShown: null,
  onClose: null,
  onClosed: null,
  icon_type: "class",
  template:
  '<div data-notify="container" class="col-11 col-sm-3 alert  alert-{0} " role="alert">' +
  '<button type="button" aria-hidden="true" class="close" data-notify="dismiss">×</button>' +
  '<span data-notify="icon"></span> ' +
  '<span data-notify="title">{1}</span> ' +
  '<span data-notify="message">{2}</span>' +
  '<div class="progress" data-notify="progressbar">' +
  '<div class="progress-bar progress-bar-{0}" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%;"></div>' +
  "</div>" +
  '<a href="{3}" target="{4}" data-notify="url"></a>' +
  "</div>"
}
  );
}

  $("body").on("click", ".notify-btn", function(event) {
  event.preventDefault();
  showNotification($(this).data("from"), $(this).data("align"), "primary");
});

  /* 03.13. Owl carousel */
  if ($().owlCarousel) {
  if ($(".owl-carousel.basic").length > 0) {
  $(".owl-carousel.basic")
  .owlCarousel({
  margin: 30,
  stagePadding: 15,
  dotsContainer: $(".owl-carousel.basic")
  .parents(".owl-container")
  .find(".slider-dot-container"),
  responsive: {
  0: {
  items: 1
},
  600: {
  items: 2
},
  1000: {
  items: 3
}
}
})
  .data("owl.carousel")
  .onResize();
}

  if ($(".owl-carousel.dashboard-numbers").length > 0) {
  $(".owl-carousel.dashboard-numbers")
  .owlCarousel({
  margin: 15,
  loop: true,
  autoplay: true,
  stagePadding: 5,
  responsive: {
  0: {
  items: 1
},
  320: {
  items: 2
},
  576: {
  items: 3
},
  1200: {
  items: 3
},
  1440: {
  items: 3
},
  1800: {
  items: 4
}
}
})
  .data("owl.carousel")
  .onResize();
}

  if ($(".best-rated-items").length > 0) {
  $(".best-rated-items")
  .owlCarousel({
  margin: 15,
  items: 1,
  loop: true,
  autoWidth: true
})
  .data("owl.carousel")
  .onResize();
}

  if ($(".owl-carousel.single").length > 0) {
  $(".owl-carousel.single")
  .owlCarousel({
  margin: 30,
  items: 1,
  loop: true,
  stagePadding: 15,
  dotsContainer: $(".owl-carousel.single")
  .parents(".owl-container")
  .find(".slider-dot-container")
})
  .data("owl.carousel")
  .onResize();
}

  if ($(".owl-carousel.center").length > 0) {
  $(".owl-carousel.center")
  .owlCarousel({
  loop: true,
  margin: 30,
  stagePadding: 15,
  center: true,
  dotsContainer: $(".owl-carousel.center")
  .parents(".owl-container")
  .find(".slider-dot-container"),
  responsive: {
  0: {
  items: 1
},
  480: {
  items: 2
},
  600: {
  items: 3
},
  1000: {
  items: 4
}
}
})
  .data("owl.carousel")
  .onResize();
}

  $(".owl-dot").click(function() {
  var carouselReference = $(
  $(this)
  .parents(".owl-container")
  .find(".owl-carousel")
  ).owlCarousel();
  carouselReference.trigger("to.owl.carousel", [$(this).index(), 300]);
});

  $(".owl-prev").click(function(event) {
  event.preventDefault();
  var carouselReference = $(
  $(this)
  .parents(".owl-container")
  .find(".owl-carousel")
  ).owlCarousel();
  carouselReference.trigger("prev.owl.carousel", [300]);
});

  $(".owl-next").click(function(event) {
  event.preventDefault();
  var carouselReference = $(
  $(this)
  .parents(".owl-container")
  .find(".owl-carousel")
  ).owlCarousel();
  carouselReference.trigger("next.owl.carousel", [300]);
});
}

  /* 03.14. Slick Slider */
  if ($().slick) {
  $(".slick.basic").slick({
  dots: true,
  infinite: true,
  speed: 300,
  slidesToShow: 3,
  slidesToScroll: 4,
  appendDots: $(".slick.basic")
  .parents(".slick-container")
  .find(".slider-dot-container"),
  prevArrow: $(".slick.basic")
  .parents(".slick-container")
  .find(".slider-nav .left-arrow"),
  nextArrow: $(".slick.basic")
  .parents(".slick-container")
  .find(".slider-nav .right-arrow"),
  customPaging: function(slider, i) {
  return '<button role="button" class="slick-dot"><span></span></button>';
},
  responsive: [
{
  breakpoint: 1024,
  settings: {
  slidesToShow: 2,
  slidesToScroll: 2,
  infinite: true,
  dots: true
}
},
{
  breakpoint: 600,
  settings: {
  slidesToShow: 1,
  slidesToScroll: 1
}
}
  ]
});

  $(".slick.center").slick({
  dots: true,
  infinite: true,
  centerMode: true,
  speed: 300,
  slidesToShow: 4,
  slidesToScroll: 4,
  appendDots: $(".slick.center")
  .parents(".slick-container")
  .find(".slider-dot-container"),
  prevArrow: $(".slick.center")
  .parents(".slick-container")
  .find(".slider-nav .left-arrow"),
  nextArrow: $(".slick.center")
  .parents(".slick-container")
  .find(".slider-nav .right-arrow"),
  customPaging: function(slider, i) {
  return '<button role="button" class="slick-dot"><span></span></button>';
},
  responsive: [
{
  breakpoint: 992,
  settings: {
  slidesToShow: 3,
  slidesToScroll: 3,
  infinite: true,
  dots: true,
  centerMode: false
}
},
{
  breakpoint: 600,
  settings: {
  slidesToShow: 2,
  slidesToScroll: 2,
  centerMode: false
}
},
{
  breakpoint: 480,
  settings: {
  slidesToShow: 1,
  slidesToScroll: 1,
  centerMode: false
}
}
  ]
});

  $(".slick.single").slick({
  dots: true,
  infinite: true,
  speed: 300,
  appendDots: $(".slick.single")
  .parents(".slick-container")
  .find(".slider-dot-container"),
  prevArrow: $(".slick.single")
  .parents(".slick-container")
  .find(".slider-nav .left-arrow"),
  nextArrow: $(".slick.single")
  .parents(".slick-container")
  .find(".slider-nav .right-arrow"),
  customPaging: function(slider, i) {
  return '<button role="button" class="slick-dot"><span></span></button>';
}
});
}

  /* 03.15. Form Validation */
  var forms = document.getElementsByClassName("needs-validation");
  var validation = Array.prototype.filter.call(forms, function(form) {
  form.addEventListener(
  "submit",
  function(event) {
  if (form.checkValidity() === false) {
  event.preventDefault();
  event.stopPropagation();
}
  form.classList.add("was-validated");
},
  false
  );
});

  /* 03.16. Tooltip */
  if ($().tooltip) {
  $('[data-toggle="tooltip"]').tooltip();
}

  /* 03.17. Popover */
  if ($().popover) {
  $('[data-toggle="popover"]').popover({ trigger: "focus" });
}

  /* 03.18. Select 2 */
  if ($().select2) {
  $(".select2-single, .select2-multiple").select2({
  theme: "bootstrap",
  placeholder: "",
  maximumSelectionSize: 6,
  containerCssClass: ":all:"
});
}

  /* 03.19. Datepicker */
  if ($().datepicker) {
  $("input.datepicker").datepicker({
  autoclose: true,
  templates: {
  leftArrow: '<i class="simple-icon-arrow-left"></i>',
  rightArrow: '<i class="simple-icon-arrow-right"></i>'
}
});

  $(".input-daterange").datepicker({
  autoclose: true,
  templates: {
  leftArrow: '<i class="simple-icon-arrow-left"></i>',
  rightArrow: '<i class="simple-icon-arrow-right"></i>'
}
});

  $(".input-group.date").datepicker({
  autoclose: true,
  templates: {
  leftArrow: '<i class="simple-icon-arrow-left"></i>',
  rightArrow: '<i class="simple-icon-arrow-right"></i>'
}
});

  $(".date-inline").datepicker({
  autoclose: true,
  templates: {
  leftArrow: '<i class="simple-icon-arrow-left"></i>',
  rightArrow: '<i class="simple-icon-arrow-right"></i>'
}
});
}

  /* 03.20. Dropzone */
  if ($().dropzone && !$(".dropzone").hasClass("disabled")) {
  $(".dropzone").dropzone({
  url: "/file/post",
  thumbnailWidth: 160,
  previewTemplate:
  '<div class="dz-preview dz-file-preview mb-3"><div class="d-flex flex-row "> <div class="p-0 w-30 position-relative"> <div class="dz-error-mark"><span><i class="simple-icon-exclamation"></i>  </span></div>      <div class="dz-success-mark"><span><i class="simple-icon-check-circle"></i></span></div>      <img data-dz-thumbnail class="img-thumbnail border-0" /> </div> <div class="pl-3 pt-2 pr-2 pb-1 w-70 dz-details position-relative"> <div> <span data-dz-name /> </div> <div class="text-primary text-extra-small" data-dz-size /> </div> <div class="dz-progress"><span class="dz-upload" data-dz-uploadprogress></span></div>        <div class="dz-error-message"><span data-dz-errormessage></span></div>            </div><a href="#" class="remove" data-dz-remove> <i class="simple-icon-trash"></i> </a></div>'
});
}

  /* 03.21. Cropperjs */
  var Cropper = window.Cropper;
  if (typeof Cropper !== "undefined") {
  function each(arr, callback) {
  var length = arr.length;
  var i;

  for (i = 0; i < length; i++) {
  callback.call(arr, arr[i], i, arr);
}

  return arr;
}
  var previews = document.querySelectorAll(".cropper-preview");
  var options = {
  aspectRatio: 4 / 3,
  preview: ".img-preview",
  ready: function() {
  var clone = this.cloneNode();

  clone.className = "";
  clone.style.cssText =
  "display: block;" +
  "width: 100%;" +
  "min-width: 0;" +
  "min-height: 0;" +
  "max-width: none;" +
  "max-height: none;";
  each(previews, function(elem) {
  elem.appendChild(clone.cloneNode());
});
},
  crop: function(e) {
  var data = e.detail;
  var cropper = this.cropper;
  var imageData = cropper.getImageData();
  var previewAspectRatio = data.width / data.height;

  each(previews, function(elem) {
  var previewImage = elem.getElementsByTagName("img").item(0);
  var previewWidth = elem.offsetWidth;
  var previewHeight = previewWidth / previewAspectRatio;
  var imageScaledRatio = data.width / previewWidth;
  elem.style.height = previewHeight + "px";
  if (previewImage) {
  previewImage.style.width =
  imageData.naturalWidth / imageScaledRatio + "px";
  previewImage.style.height =
  imageData.naturalHeight / imageScaledRatio + "px";
  previewImage.style.marginLeft = -data.x / imageScaledRatio + "px";
  previewImage.style.marginTop = -data.y / imageScaledRatio + "px";
}
});
},
  zoom: function(e) {}
};

  if ($("#inputImage").length > 0) {
  var inputImage = $("#inputImage")[0];
  var image = $("#cropperImage")[0];

  var cropper;
  inputImage.onchange = function() {
  var files = this.files;
  var file;

  if (files && files.length) {
  file = files[0];
  $("#cropperContainer").css("display", "block");

  if (/^image\/\w+/.test(file.type)) {
  uploadedImageType = file.type;
  uploadedImageName = file.name;

  image.src = uploadedImageURL = URL.createObjectURL(file);
  if (cropper) {
  cropper.destroy();
}
  cropper = new Cropper(image, options);
  inputImage.value = null;
} else {
  window.alert("Please choose an image file.");
}
}
};
}
}

  /* 03.22. Range Slider */
  if (typeof noUiSlider !== "undefined") {
  if ($("#dashboardPriceRange").length > 0) {
  noUiSlider.create($("#dashboardPriceRange")[0], {
  start: [800, 2100],
  connect: true,
  tooltips: true,
  range: {
  min: 200,
  max: 2800
},
  step: 10,
  format: {
  to: function(value) {
  return "$" + $.fn.addCommas(Math.floor(value));
},
  from: function(value) {
  return value;
}
}
});
}

  if ($("#doubleSlider").length > 0) {
  noUiSlider.create($("#doubleSlider")[0], {
  start: [800, 1200],
  connect: true,
  tooltips: true,
  range: {
  min: 500,
  max: 1500
},
  step: 10,
  format: {
  to: function(value) {
  return "$" + $.fn.addCommas(Math.round(value));
},
  from: function(value) {
  return value;
}
}
});
}

  if ($("#singleSlider").length > 0) {
  noUiSlider.create($("#singleSlider")[0], {
  start: 0,
  connect: true,
  tooltips: true,
  range: {
  min: 0,
  max: 150
},
  step: 1,
  format: {
  to: function(value) {
  return $.fn.addCommas(Math.round(value));
},
  from: function(value) {
  return value;
}
}
});
}
}

  /* 03.23. Modal Passing Content */
  $("#exampleModalContent").on("show.bs.modal", function(event) {
  var button = $(event.relatedTarget);
  var recipient = button.data("whatever");
  var modal = $(this);
  modal.find(".modal-title").text("New message to " + recipient);
  modal.find(".modal-body input").val(recipient);
});

  /* 03.24. Scrollbar */
  if (typeof PerfectScrollbar !== "undefined") {
  var chatAppScroll;

  $(".scroll").each(function() {
  if ($(this).parents(".chat-app").length > 0) {
  chatAppScroll = new PerfectScrollbar($(this)[0]);
  $(".chat-app .scroll").scrollTop(
  $(".chat-app .scroll").prop("scrollHeight")
  );
  chatAppScroll.update();
  return;
}
  var ps = new PerfectScrollbar($(this)[0]);
});
}

  /* 03.25. Progress */
  $(".progress-bar").each(function() {
  $(this).css("width", $(this).attr("aria-valuenow") + "%");
});

  if (typeof ProgressBar !== "undefined") {
  $(".progress-bar-circle").each(function() {
  var val = $(this).attr("aria-valuenow");
  var color = $(this).data("color") || themeColor1;
  var trailColor = $(this).data("trailColor") || "#d7d7d7";
  var max = $(this).attr("aria-valuemax") || 100;
  var showPercent = $(this).data("showPercent");
  var circle = new ProgressBar.Circle(this, {
  color: color,
  duration: 20,
  easing: "easeInOut",
  strokeWidth: 4,
  trailColor: trailColor,
  trailWidth: 4,
  text: {
  autoStyleContainer: false
},
  step: (state, bar) => {
  if (showPercent) {
  bar.setText(Math.round(bar.value() * 100) + "%");
} else {
  bar.setText(val + "/" + max);
}
}
}).animate(val / max);
});
}

  /* 03.26. Rating */
  if ($().barrating) {
  $(".rating").each(function() {
  var current = $(this).data("currentRating");
  var readonly = $(this).data("readonly");
  $(this).barrating({
  theme: "bootstrap-stars",
  initialRating: current,
  readonly: readonly
});
});
}

  /* 03.27. Tags Input */
  if ($().tagsinput) {
  $(".tags").tagsinput({
  cancelConfirmKeysOnEmpty: true,
  confirmKeys: [13]
});

  $("body").on("keypress", ".bootstrap-tagsinput input", function(e) {
  if (e.which == 13) {
  e.preventDefault();
  e.stopPropagation();
}
});
}

  /* 03.28. Sortable */
  if (typeof Sortable !== "undefined") {
  $(".sortable").each(function() {
  if ($(this).find(".handle").length > 0) {
  Sortable.create($(this)[0], { handle: ".handle" });
} else {
  Sortable.create($(this)[0]);
}
});
  if ($(".sortable-survey").length > 0) {
  Sortable.create($(".sortable-survey")[0]);
}
}

  /* 03.29. State Button */
  $("#successButton").on("click", function(event) {
  event.preventDefault();
  var $button = $(this);
  if (
  $button.hasClass("show-fail") ||
  $button.hasClass("show-spinner") ||
  $button.hasClass("show-success")
  ) {
  return;
}

  $button.addClass("show-spinner");
  $button.addClass("active");
  setTimeout(function() {
  $button.addClass("show-success");
  $button.removeClass("show-spinner");
  $button.find(".icon.success").tooltip("show");
  setTimeout(function() {
  $button.removeClass("show-success");
  $button.removeClass("active");
  $button.find(".icon.success").tooltip("dispose");
}, 2000);
}, 3000);
});

  $("#failButton").on("click", function(event) {
  event.preventDefault();
  var $button = $(this);
  if (
  $button.hasClass("show-fail") ||
  $button.hasClass("show-spinner") ||
  $button.hasClass("show-success")
  ) {
  return;
}

  $button.addClass("show-spinner");
  $button.addClass("active");
  setTimeout(function() {
  $button.addClass("show-fail");
  $button.removeClass("show-spinner");
  $button.find(".icon.fail").tooltip("show");
  setTimeout(function() {
  $button.removeClass("show-fail");
  $button.removeClass("active");
  $button.find(".icon.fail").tooltip("dispose");
}, 2000);
}, 3000);
});

  /* 03.30. Typeahead */
  var testData = [
{
  name: "May",
  index: 0,
  id: "5a8a9bfd8bf389ba8d6bb211"
},
{
  name: "Fuentes",
  index: 1,
  id: "5a8a9bfdee10e107f28578d4"
},
{
  name: "Henderson",
  index: 2,
  id: "5a8a9bfd4f9e224dfa0110f3"
},
{
  name: "Hinton",
  index: 3,
  id: "5a8a9bfde42b28e85df34630"
},
{
  name: "Barrera",
  index: 4,
  id: "5a8a9bfdc0cba3abc4532d8d"
},
{
  name: "Therese",
  index: 5,
  id: "5a8a9bfdedfcd1aa0f4c414e"
},
{
  name: "Nona",
  index: 6,
  id: "5a8a9bfdd6686aa51b953c4e"
},
{
  name: "Frye",
  index: 7,
  id: "5a8a9bfd352e2fd4c101507d"
},
{
  name: "Cora",
  index: 8,
  id: "5a8a9bfdb5133142047f2600"
},
{
  name: "Miles",
  index: 9,
  id: "5a8a9bfdadb1afd136117928"
},
{
  name: "Cantrell",
  index: 10,
  id: "5a8a9bfdca4795bcbb002057"
},
{
  name: "Benson",
  index: 11,
  id: "5a8a9bfdaa51e9a4aeeddb7d"
},
{
  name: "Susanna",
  index: 12,
  id: "5a8a9bfd57dd857535ef5998"
},
{
  name: "Beatrice",
  index: 13,
  id: "5a8a9bfd68b6f12828da4175"
},
{
  name: "Tameka",
  index: 14,
  id: "5a8a9bfd2bc4a368244d5253"
},
{
  name: "Lowe",
  index: 15,
  id: "5a8a9bfd9004fda447204d30"
},
{
  name: "Roth",
  index: 16,
  id: "5a8a9bfdb4616dbc06af6172"
},
{
  name: "Conley",
  index: 17,
  id: "5a8a9bfdfae43320dd8f9c5a"
},
{
  name: "Nelda",
  index: 18,
  id: "5a8a9bfd534d9e0ba2d7c9a7"
},
{
  name: "Angie",
  index: 19,
  id: "5a8a9bfd57de84496dc42259"
}
  ];

  if ($().typeahead) {
  $("#query").typeahead({ source: testData });
}

  /* 03.31. Full Screen */

  function isFullScreen() {
  var isInFullScreen =
  (document.fullscreenElement && document.fullscreenElement !== null) ||
  (document.webkitFullscreenElement &&
  document.webkitFullscreenElement !== null) ||
  (document.mozFullScreenElement &&
  document.mozFullScreenElement !== null) ||
  (document.msFullscreenElement && document.msFullscreenElement !== null);
  return isInFullScreen;
}

  function fullscreen() {
  var isInFullScreen = isFullScreen();

  var docElm = document.documentElement;
  if (!isInFullScreen) {
  if (docElm.requestFullscreen) {
  docElm.requestFullscreen();
} else if (docElm.mozRequestFullScreen) {
  docElm.mozRequestFullScreen();
} else if (docElm.webkitRequestFullScreen) {
  docElm.webkitRequestFullScreen();
} else if (docElm.msRequestFullscreen) {
  docElm.msRequestFullscreen();
}
} else {
  if (document.exitFullscreen) {
  document.exitFullscreen();
} else if (document.webkitExitFullscreen) {
  document.webkitExitFullscreen();
} else if (document.mozCancelFullScreen) {
  document.mozCancelFullScreen();
} else if (document.msExitFullscreen) {
  document.msExitFullscreen();
}
}
}

  $("#fullScreenButton").on("click", function(event) {
  event.preventDefault();
  if (isFullScreen()) {
  $($(this).find("i")[1]).css("display", "none");
  $($(this).find("i")[0]).css("display", "inline");
} else {
  $($(this).find("i")[1]).css("display", "inline");
  $($(this).find("i")[0]).css("display", "none");
}
  fullscreen();
});

  /* 03.32. Html Editors */
  if (typeof Quill !== "undefined") {
  var quillToolbarOptions = [
  ["bold", "italic", "underline", "strike"],
  ["blockquote", "code-block"],

  [{ header: 1 }, { header: 2 }],
  [{ list: "ordered" }, { list: "bullet" }],
  [{ script: "sub" }, { script: "super" }],
  [{ indent: "-1" }, { indent: "+1" }],
  [{ direction: "rtl" }],

  [{ size: ["small", false, "large", "huge"] }],
  [{ header: [1, 2, 3, 4, 5, 6, false] }],

  [{ color: [] }, { background: [] }],
  [{ font: [] }],
  [{ align: [] }],

  ["clean"]
  ];

  var quillBubbleToolbarOptions = [
  ["bold", "italic", "underline", "strike"],
  [{ list: "ordered" }, { list: "bullet" }],
  [{ size: ["small", false, "large", "huge"] }],
  [{ color: [] }],
  [{ align: [] }]
  ];

  var editor = new Quill("#quillEditor", {
  modules: { toolbar: quillToolbarOptions },
  theme: "snow"
});

  var editorBubble = new Quill("#quillEditorBubble", {
  modules: { toolbar: quillBubbleToolbarOptions },
  theme: "bubble"
});
}

  if (typeof ClassicEditor !== "undefined") {
  ClassicEditor.create(document.querySelector("#ckEditorClassic")).catch(
  error => {}
  );
}

  /* 03.33. Showing Body */
  $("body > *")
  .stop()
  .delay(100)
  .animate({ opacity: 1 }, 300);
  $("body").removeClass("show-spinner");
  $("main").addClass("default-transition");
  $(".sub-menu").addClass("default-transition");
  $(".main-menu").addClass("default-transition");
  $(".theme-colors").addClass("default-transition");

  /*03.34. Keyboard Shortcuts*/
  if (typeof Mousetrap !== "undefined") {
  //Go to next page on sub menu
  Mousetrap.bind(["ctrl+down", "command+down"], function(e) {
  var $nextItem = $(".sub-menu li.active").next();
  if ($nextItem.length == 0) {
  $nextItem = $(".sub-menu li.active")
  .parent()
  .children()
  .first();
}
  window.location.href = $nextItem.find("a").attr("href");
  return false;
});

  //Go to prev page on sub menu
  Mousetrap.bind(["ctrl+up", "command+up"], function(e) {
  var $prevItem = $(".sub-menu li.active").prev();
  if ($prevItem.length == 0) {
  $prevItem = $(".sub-menu li.active")
  .parent()
  .children()
  .last();
}
  window.location.href = $prevItem.find("a").attr("href");
  return false;
});

  //Go to next page on main menu
  Mousetrap.bind(["ctrl+shift+down", "command+shift+down"], function(e) {
  var $nextItem = $(".main-menu li.active").next();
  if ($nextItem.length == 0) {
  $nextItem = $(".main-menu li:first-of-type");
}
  var $link = $nextItem
  .find("a")
  .attr("href")
  .replace("#", "");
  var $firstSubLink = $(
  ".sub-menu ul[data-link='" + $link + "'] li:first-of-type"
  );
  window.location.href = $firstSubLink.find("a").attr("href");
  return false;
});

  //Go to prev page on main menu
  Mousetrap.bind(["ctrl+shift+up", "command+shift+up"], function(e) {
  var $prevItem = $(".main-menu li.active").prev();
  if ($prevItem.length == 0) {
  $prevItem = $(".main-menu li:last-of-type");
}
  var $link = $prevItem
  .find("a")
  .attr("href")
  .replace("#", "");
  var $firstSubLink = $(
  ".sub-menu ul[data-link='" + $link + "'] li:first-of-type"
  );
  window.location.href = $firstSubLink.find("a").attr("href");
  return false;
});

  /*Select all with ctrl+a and deselect all with ctrl+d at list pages */
  if ($(".list") && $(".list").length > 0) {
  Mousetrap.bind(["ctrl+a", "command+a"], function(e) {
  $(".list")
  .shiftSelectable()
  .data("shiftSelectable")
  .selectAll();
  return false;
});

  Mousetrap.bind(["ctrl+d", "command+d"], function(e) {
  $(".list")
  .shiftSelectable()
  .data("shiftSelectable")
  .deSelectAll();
  return false;
});
}
}

  /*03.35. Context Menu */
  if ($().contextMenu) {
  $.contextMenu({
  selector: ".list .card",
  callback: function(key, options) {
  var m = "clicked: " + key;
},
  events: {
  show: function(options) {
  var $list = options.$trigger.parents(".list");
  if ($list && $list.length > 0) {
  $list.data("shiftSelectable").rightClick(options.$trigger);
}
}
},
  items: {
  copy: {
  name: "Copy",
  className: "simple-icon-docs"
},
  archive: { name: "Move to archive", className: "simple-icon-drawer" },
  delete: { name: "Delete", className: "simple-icon-trash" }
}
});
}

  /* 03.36. Select from Library */
  if ($().selectFromLibrary) {
  $(".sfl-multiple").selectFromLibrary();
  $(".sfl-single").selectFromLibrary();
  /*
      Getting selected items
      console.log($(".sfl-multiple").selectFromLibrary().data("selectFromLibrary").getData());
      console.log($(".sfl-single").selectFromLibrary().data("selectFromLibrary").getData());
      */
}
}
  init();
};

  $.fn.dore = function(options) {
  return this.each(function() {
  if (undefined == $(this).data("dore")) {
  var plugin = new $.dore(this, options);
  $(this).data("dore", plugin);
}
});
};

  function configs(data){
    let img = null;
    if(data == "birbank") {
      img = "<svg id=\"Layer_1\" data-name=\"Layer 1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" viewBox=\"0 0 289 290\"><image id=\"bblogo\" width=\"289\" height=\"290\" xlink:href=\"data:image/png;base64,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\" style=\"isolation:isolate\"/></svg>"
    }else if(data == "musteribank"){
      img = "<svg version=\"1.1\" id=\"as_1_\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 300 300\" style=\"enable-background:new 0 0 300 300;\" xml:space=\"preserve\">\n" +
          "<image style=\"overflow:visible;enable-background:new    ;\" width=\"207\" height=\"227\" id=\"as\" xlink:href=\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAM8AAADjCAYAAAAi70ASAAAgAElEQVR4nO2dB3hUVdrHz73Te0kv\n" +
          "gICCdDBEiggqYAEUlN4hQKhKwLXsurvousXyLSorSE1CTQJSBYJIRyIsRbqggFLSk+m93e95z2QQ\n" +
          "dihJ5t5k5ub+nmddH+4xTO7Mf865b/m/BEVRiKN+cF2+qnac+6mvt1KXQoiEJYLGyYelXVNOEVIJ\n" +
          "96ZEAPyGfgPqA/evN2S6hVnHbAcL2nh1BuSz2RHB5yFSoUDCZo3dqjFDpilHDMpseHcmsuB2njqE\n" +
          "cjgJ/aLsVcZ1m8Z4KioRT6NCpFiMEI+HEEUhyu1GPpMF+aw2pBo9+HTsR+91ajA3JwLhxFNHmLfk\n" +
          "DzQsX7vBee6SgNSqESmXIeTzBf/lBIEolwu5f7uJov40OzMqI31S0BqOsIATD8M4L/4cpVuw/LRt\n" +
          "7/fJiM9DvCgN3mUeCEHg3YcgSZSUt0QlfLSp6UHLOeoHkrvvzOAzW4iKj77cXDhiaoX12/3JvCh1\n" +
          "9YQDUBQipRIERzvz5vxlQdc5wgIuYMAAxpzNaYbM3GXuX66R8FzDT070H9FqsssTCBFiMXJdvvJs\n" +
          "0DWOsIATD43Yj59uqv8y84Tt+2NaUiJB/OQEv2Du9WzzMCiECIEA+exO4UNWctQTnHhowFteKdD9\n" +
          "Z8UB08bt3SmHE/Fjo29H0ELC60GkSOCK7LvDXjjxhIhx9YYMw9I1n7lvFCJetBYRWk3Nj2j3gkCI\n" +
          "stjgyPfLPa5yhAGceGqJ9UBBB8PiVQWOk2ekhFiE+I0Sa39E+19AOC43IqQSJHvu6TeCrnOEBZx4\n" +
          "aoj7t5sy/cLMY6Ztu9sQFIV4cEQjiNB3mjvxUchzswipxg8/LX2m28mg6xxhAZfnqQH65WvfNy5b\n" +
          "O89TWu4/oolF9IoGEqROF3Jfv4Vkzz1lTsz6QkVIxNwbFKZw4qkG1m8P9NQvXrXbfvqciKdUIFIh\n" +
          "p1c0yH9U85RVIoLHQ8rhAw9GvTXjWVIm5d6cMIYTzwNwXrwcpV+y+ph198HmIBbYbWgXDUkin8WK\n" +
          "fHojEqe0d2hmTOgh6/00d1SLADjx3AOfxUoYlq9dbsjKTYNCTV5sFM650H1EQx4P8pSUIVKjRuq0\n" +
          "UV9pX0+bEbSOI2zhxPM/mLd9+5JhyaqtjnOXBLxAASfdogGB6o3IazIjxcvP39K+Oa2NsPkjXP1a\n" +
          "hMGJpwrHmQuJhsWrjln3HU4m+AJEalU46kUrJIkouwN5K3RI1OpRr3ra+MGKgS9urf/fnqM2NHjx\n" +
          "eHV6Ur941Tfmr7f38+qNiBcXgxvTaN9tvF7kKa/E/TvKoS8f1MxK68OL0niC1nJEDA1aPKacLWn6\n" +
          "ZWuWu36+QvBjY3BSkv4oGgEV1shrNCNJakdb9Nuz2opTO/watI4j4miQ4rH/cLKFfsXag/ZDR+OR\n" +
          "gI94GjUjooGAgLukHAkSYpF60qgP1JNHvx+0jiNiaVDi8RSWiAzL1nxr2ri9l8/u8BdwkiQjAQGv\n" +
          "To9LdWTPP3NV+/rkzsLHmhqC1nJENA1GPIbs3Axjdt5817UbBB9Cz+AdwMQRzWaHKmskatPCq50x\n" +
          "8WX5Ky/kB63jYAWsF4/t4A8d9IuyCuzHfpQSChniqZT+C3TvNpQPect1uGRHOWTAHu3s9BdIlYKG\n" +
          "KlGOcIW14nHfuCXRf7XqoCV/byr4AeAjGhNAhYDJjF1vpE93MWpnT2kvTml/o55/fY46gJXiMSxf\n" +
          "974hc908d1EJ4sdEI0IkZKSsBhrfPGUViB8fi7TTx/9RNWH4R0HrOFgLq8TjL+Bcudv+43kRTyFD\n" +
          "JBzRmIiiURR+rqG8PqQY3P90VEZ6V35inDNoLQtw/vRzlPPspYFenb4dqVaeEz3+6C5xp3ZFbPxd\n" +
          "aworxOP6+ZpavyjrhGX3gebI6/MXcNLdY4OqWgYcDgQun6K2jzu1b0x+Rtan59GgdSzAVnC8hWn1\n" +
          "13ttP5xIhsY8uJcESeD2cuFjzRzqtBED5P377mXj715dIlo8uIAzK3ehcd3G6d7SCsSLYaCAE91R\n" +
          "IVBWgUilAqnHDVujnZM+NmgdC/BW6vi6LzPzTV9v70NZ7f57yqtyKKP8//Dq/RbB6vHDC2I+fOcp\n" +
          "Nt6H6hCx4rHk7+ut/3JFPi7gBNtaRnpsqnI2eiPyGY1I9mLvkqg3p7YVtWpRGbSWBZhyt6TpF69c\n" +
          "7rp6neBDmdL9mv3wDuwEz20U/f4fvtK+PqlBVoNHnHgcp6GAc+VJ64Ej8dBBBpXPtCc6UcD21o08\n" +
          "JaVI2OJRn2byyCnKEa+y0nzdcepsY/3CrBPWw8diCD7ff0+r6WqKfF6UtHphkqh96wb3HBQxHgZg\n" +
          "72TIylljytkyzGu2IH5M1O/2TrTnbPwBAULAR+oJwwvU6eP6CJIT7EFrIxyvwUgasnKXmVZ/neY1\n" +
          "mhDsNtX+IgJXU5kEuW8UIdOmneti2rd+JmgNy4kI8Zg37xyoX7Jqo/OnKzx+tAaHhmkXDUAS/ikF\n" +
          "JgsSd2zj1GZM6SLt1f1M0DoWYNmxp7f+q+x8x+kLAsiB8RPian5PKYSfAZ3nfuoSdK0BENbicZw4\n" +
          "01S3KBt6bGJImRQJwIGToSgaDgjcKkE8rQZFvTPrY820ce8GrWMBLpgN9PnSM5bt3zWH4IqgSXJI\n" +
          "95SUiJG3Qi/yFJWK2Bquvx9hKR73rSKRISt3u3nTzj4+sxUJEuN/P04wsdvojYjyeJB8wPPXNdPH\n" +
          "dxG1fbw0aB0LMKxY975hZd5fPbeKCVxxwefTcE/xf0/Q/r5EAGEnHuO6TWmGJauXu367iQs4+fEx\n" +
          "DImGRJTNjhvURC2b+TTTJ45QvNZvQ9A6FgA5G93nS390HD0lhdlAfPgyoumeglUWmZTgJNXKBmcL\n" +
          "HDbisRccb61ftLLAevCICoo3GT2i+XzIU1yKc0LqtJEHo+amP0sqlaz76vTqjaRu/uLDpryt3Smf\n" +
          "z288T2dkkiBwGF/eqsXZhmiTVe/icV27LjNmrttt3rKrO4SGBY2SmDuiQXgVbJ50BiTp2cUYNWca\n" +
          "a4s4jXlbxxgWZq123ypCvKgqg0Y6PLTvAKoteGoVUg7pPyToYgOgXsWDHThXrp/nAZP0uBhEqgXM\n" +
          "HdFcLhx+hqiSdk76HPX44Z8HrWMBzjMXEivnLz5n+/6/WhiQdfuIRoeHdoBAl+z1W0g7d9oWcUqH\n" +
          "BllFXi9JUuu+71P0i7K/tx87Jcb2TlAdgB88g5aGRiBnU6lDlMuDFINevKydPSVF0CTZWte/M9P4\n" +
          "rDZCt2D5JtPqDYN8LvfdeTDa7qf/Hz6jCXkr9Ugx9JWr8V98+GjQugZCnYrHffU3pe6rlQWWnXva\n" +
          "UB4v4kMBJxPVAeiOIk6weWrdwquZnf6c/IVnDgWtYwHmTTuG6petzXFeuMyDe0rIpPTuNIH76fYg\n" +
          "b2kZhLcp9eQxc1Vjh7By964udSIen8lMGNdsnG9c83UGPKiDUw0YbzAlGvjgeMH3WSFHqpED16vT\n" +
          "x47kqVWs6+p0nv8pTvdl1gnb/iP+YcGB2UB0gwMDBgQV6/J+vS9rX5+UImjamHW7d01hXDyWXfuw\n" +
          "Sbrj5FkRDLSl3YHzTgj/kQKsniQ9uhij5k5rL36iHevO45TdQRhW5v3LsHzdO57yCiRIiEeIbq85\n" +
          "VNUla7X5d+82Lb3a2VOek7/4LCt379rAmHjcNwslun8vOWfeuqs5IRT4J0EzeURzubDvs7BpE0qd\n" +
          "NmKuiqUBAeu+wym6z5cdcZw+L+JptYhUyBg5ouFwfmkFIoR8mBO0RTtz4mukQs7Zy94BI+Ixbfhm\n" +
          "jO6LZas9t4r9SU4+g0e0gM0TRSF5vz4XtLOnpAoaJ7GuiNN9/ZZM/9XK781bd3XEExvgy4gJYLcx\n" +
          "mxFUdkifetKozUhn5e5NB7SKx2swkRUfzj9r3rSjDSmXI1KlYO6IBuFnixUn6cQdWjs1r09ibVen\n" +
          "cdWGDP2yNZ95CkuqGv4Y+DKC++l0IQ8EBJISkGbauDmqccMadEDgYdAmHphlU/rW34qdP54XwHxO\n" +
          "Rjo60R2jOUrLsT2uZsqYTG1G+qSgdSzA/t8fm+o+W3LGduS4gqdS4ApmHC6m87beDufr8X2V9e9z\n" +
          "NfrtWW34SfENqsizNtAiHuu+Iyll73x4wmswIH5cLLMBAejqtDuQ7Plet7Qz0zqL2rGviBPKavQL\n" +
          "M781rd/WBzubQkif7pwN+r0jFNrLIZyvnT35OflLvbmAQDUJWTzGleszKv75xWdg74TdapgIleIj\n" +
          "hRObCgqbNaHUU8eMUw4buCZoHQsI5GxcFy/zeGA+z4RtVmC3KavAOSHliEFbNNPGDWZjOJ9JQhKP\n" +
          "fvHKjyr+/sU7vGiGQtCBnE15Jf7mVQ4dUKB9c8bTPLWSdW+y68pvysqP/3PZuvdwPNSh4ZwNotnZ\n" +
          "FAXC+WYcFJB0TzVrZ07sKnnqyYtB6zgefitrKx79wqxFlZ8unI6LDqVi+gdBVRVxQo5B+lSqTZuR\n" +
          "3knSrfPPQetYgO6L5SsMK9b6RziC8YaQz8j9hJ4l+CKCqRCaaeMazNQG+4kzjR0nzszwlJR2RQTh\n" +
          "5sVEn5c+2WmBuHNoo15qJR5oqqr4+2fz8Dh10X0cVkJ6VQSC5B9fq0WqsYM/18yYOCdoDQuw7Nzb\n" +
          "27B8zXbHqfNicAAi5AzkbJD/2Hu7vm/gCxc0U8f2ELZozvqpDbYjx1sbV+butR8/Ew+9W5TXi/8c\n" +
          "Jo4TYiESp3Ys0aSN7i3p3rlWO2+NxWPdezilaPKbJ3hqJYLWaFqFQxKIsjtxr430me7G6D9nNGej\n" +
          "zZMbWqEXrDhp3pLfEp5psEkjYuCIhsc42vHuLXysuU8zfdwIxWv9WdnwdyeQoDcsWX3QvDk/1Wu3\n" +
          "+y2XwXuuKi8YqDLHEVuhEEW9+8Yf1RNrbpVcI/E4z/0UVzhmVgls/9ieiM5vSdLfWEU5XHCkWB/1\n" +
          "h+nDg9awANwKvWTVPIhw4YCAkCGTRvhwlJThnJBq7NA92oz050m5jPUVAvolqz8yZue+4ymCnFg0\n" +
          "IiSi+x+Bq0z6wQE2aeWCztLnetRohH+1xQOzOwvHznS4Lv8q4CfE0t4fAt8CUEYf/dc3e7Gxfsp2\n" +
          "+Ghr3YIVx+0nTkt5SiUilbL7v6mhAB8IeFbU6ZG0RxejNmNKJ0lqJ9aPcYQTkX7p6kOOY6ekkA/D\n" +
          "Cfrq3F/40oY+r6QEX3LeUhEvWlvtObHVboYr/8sn11wXfxHgVl5ahYPwMU3U8lFv7KfzkkRtWrAq\n" +
          "bwOuMvpFWYdNW3alQhISm5kATAUEikqxNZfmvYyPNeljWekAdCfu327KdAuzjlnz97aBTmR+cqI/\n" +
          "i1zd++ujcKet66dfSOu3B6YoR7/2VdCa+1At8ZjWbx1j3rSjieCRRvS96VW5Bqh/Ez/R3pGY+ZmM\n" +
          "ZFmewbhuc5p+UdYK981C3IbBaM6mUo8NTeQv972unTutjbBZE9a3DOgXr8JHNDxKJj4WkWpV7e4v\n" +
          "QeB8l+3YqTdrIp6HHtvcV68rbw4ab4TjAN1+0J5bRUjSrbM5Yem/VaSSPRW7jpNnG+u+WHbW9sNx\n" +
          "FSEUIYikMVZNDvVoZeVI9PhjXs2MCYMVA1/cGrSOZWDDxiWrdzjP/SQi8SiZah7RHgC0sQiaP+Jo\n" +
          "tDlLcv9Vd/PQnafiky8vgyP+bUdJmvAUFiNxt87m+C//pWWLcOC50JCZm2Nct3EYZbbiKA9TPtr4\n" +
          "76vQBSyBD2pmTOzLj4txB61lEc6ffonSf5V9zPrdweYgFn5SwJ+BrtNQ0J88kAeKx/T1N0Ot3+6P\n" +
          "5ycl0PcBIEkEkRBxSgdHwuJP1WypFrBs2z1Qv3T1Bsfp8wLwfCbjmPKb81sCg7e0JKWDQ/vmtA7S\n" +
          "7qmsTB4HwKNklqzONeZsGubVGREPBjLT3OYCtgCkQmELuvAA7iseeMH6L7PyoLWANv80SNYVw9SB\n" +
          "5t7E7C+kbGiucl35VVk5f8lZ6659TSBnEKp97X0JONYUliNelBpFv/v6x5pp41kfELDk7+2p+0/m\n" +
          "Hud5/ygZfmItPLUfBlSzmM1I3PbxPQ9ZeRf3FY8pd+s897XrBB8+DHRE1yCEajAiUqNGcZ/+NYkN\n" +
          "wtF/lf0Z9NpAPgWX1dBiX3sP4N5BDszlRPK+vUq0b05tJXr8MVZXCOBRMktWHbMeOJIMH25Bo0Rm\n" +
          "vpRg17HZEWwS8hefeyPo4gO4p3g8pRUCQ1buPFJNX5U0lL57TRaU8H/zekW6F7T1YEEH/cKsAvvR\n" +
          "U1LYBfzhe4b85hwO5CkpR8LHmlLa2VNeZXtAwFuGP3vrjXlbBvkMZsSPi2ZmlMwduItLkXbGxD01\n" +
          "bW+5p3jMm3d86Lr6KxI+2pSeFwxJ0KISFDVn6nr5C5GbAPWUV/J1ny0pMOZsToVdRhCwr2UgZ4Or\n" +
          "yUvK8AdHPXn0wajZk59jWyj/fzGt3zZGvzh7pevaDZKv1TBzRAsQ6GUqLEayZ54yR/9lTt+gNQ8h\n" +
          "KFQNjViFI6e6PEWlPNy5GOoLB+GUVSDJE+1tSbmLZUHXIwTTus3TdQtXLPIUl6HbBbEM2TxR4FhT\n" +
          "qUPiJzs5ojKmpkh6sLtlwH78dFP94pXHbPu+j4HuYLDwZeqI5v9ionB4n8BtLi8fj3r39S61KV0K\n" +
          "2nmsu/ZNcF2+yqMlNA0PYnCelEpQzLw3GwddjwDsx39sql+w4kfbkf+qoGcJh0d9NNvXoruHBoO5\n" +
          "R9QfZ3+unjhiLiEWsbYezVNSJjCsyNli3rSjH+RZsDVwQDRMCAeeHXUGnBuTdk81qieP7iXt2bXW\n" +
          "w8uCxGPZfeAjnAmHseGhvn4fhWBKdfSfMz4XtnosoqqjfWYzUfnvJftNeVt7wYcajxyEszcT9WhV\n" +
          "poKUzYFkL/S6pX19ckdRm5asHBocwLh203TjirULnZevElAdwIN5QUwe0aw25KmoRKLWLb2qMUP+\n" +
          "QIfb6V3HNueFS1GFw6dVYC8wkgxaXNMXjEvhWzZ3JuctlUTSNyhYZ+mXrl7punSFxOXs0OzHmN+c\n" +
          "G1c/Q4hbO2vSJOXwV1g5NDiA7dDRDvqvVh62/XBcATs5PqIx4VOOAhbBbuweC10AiiEDtmhnpr1G\n" +
          "V1L+rp3HuvvA5z6Hw1/uECpeL4KfpZ2V9kykCMdx5kKifmHmSduho/GI5CF/LR+9YzluQyD/0GAw\n" +
          "FRw3rEA7ffxzbHasgQJOw4qqUTIOJ7a3YvS5BuomwaOBz8cG/+rJo54StXmc1t38LvHYCk6+RvCC\n" +
          "TnI1B3adSj2S9exmlPXtFfZeaj6zhTBk5S43rMxL81Xq/aVI+IjGkJmJxYo8eiOSdGjj1Lwx6SlZ\n" +
          "76dr1EcSaRizc981ZOX90/XbDQLclW77+TEkHK/BiJDThcQd2jjUU0a/wFSE97ZS4FvXefFnKV27\n" +
          "Dnz4NLPSOgVdCzMs+ft66xdm5jvOXBRAFA085xjJ2dweGlyEq3+j5kzN1M6ezEq/uQC2Qz900C/K\n" +
          "PmwvOKEglAr/4DLE4HON3YF3G0GTJKROG/VHddrIGneH1oTfxXPiTLrPZAq9Ahj7D1Qi2bM9SiRP\n" +
          "hm8TlvvadaVuUVaB5Zvv2uAMduOk22FM2gkY0JvMSPbicyXa2ZPbilqzNyAAJUv6JasKrLv2t4Ej\n" +
          "Gu3jHO8Efyn5kKesDJtCqieP2qOZMnZAXUzm/l08P56bQIsngduDCJKHFIP7h20btSEr913DinX/\n" +
          "gsQtfVOh7wHpbxmAZxtB80d80e9lTFGOGMTagABls8Pxd6Fx3abp7sJiHKHEXn4Mjci8PbjM60Oy\n" +
          "55+5pZk8+qm6HJOJxQNTxVxXrydDYWOo+CwWJGr3uCMcW6kdp841rvj4Pz/ZC45LwX6JzqnQdxF4\n" +
          "Y0srcDRNOerV41Fzp3WvSYtvpGHdc6irbsGKA86zF0QkHsicyOhzDeSFsE95u8fdmhkTXpL377s3\n" +
          "aB3DYPG4Lv3SyFup42F/6RB/Kahfk7/w7BdB1+oZ3WdLVxuycsf4rFYkSE5CiMfcMcJns2F3U8mT\n" +
          "nRza2VO6hpKIC3dcV39T6v+z4pR5x97mBEn4v5CYHCXjdOJaP0HjRAjtf6wc/dofSamkXqK5WDzu\n" +
          "3252gTM5TxPa2ApIREHCS/bisx8EXawnXL/ekFXM+6TQur9ABUc0/OYyEX4OONZAhYBGjbQZ6Ws0\n" +
          "U8eMI+XsnGmDI5TZeQtNOZun+6sitL9Pb2DQORbapdUTRxSoxg97Sdj8EVPQ2jrEL54bha/47E7E\n" +
          "iw4tMQquLdLePW6Fy3wcx4/nEktm//mW+3oh4Q8IIIbCzwTyGUzIZ7EhSY8njdHvzGoZ6ZXjD8Ky\n" +
          "/buX9F+t3Oo4e1EApUTwhcno8RdKamx28PLTaaaO7RYuzrFYPJ6yipZ0HNng3smee/qPQdfqAev+\n" +
          "Iymlc/5yAkpecIiU8jEybRtXCBSVIEHTxij6z3PGKoez04Ae4TEyP0fpPltyHvtpQ+NfIELJ1PEX\n" +
          "CmRhgkP71l715NEjlYPDy7ARi8dbUdkI17OFAJRB8KM1YOixsX5/JYRsBwpSiqe8eYIUi3GTGlPV\n" +
          "z7jIkKKQcvjAC9rZk1MFjZNZN5EO3enNsHbjMHhQhzo0xhr/qiy0cMlSQhxSvzUjUzVmyNRwDLbw\n" +
          "IdLmrTSoQ915IKsre7pbuaBRYr1+gBynzjYu/cP7J+CbkYScFd3CgQoBXGSoQ+L2rdzajPSebJ1I\n" +
          "B5i37hqoX7Zmg+vCZeaPaIHnGqEAKV/rd1kzdXxXYcvw9dTmU3YHz2uxCLCXb22BG+l0I2Grx76t\n" +
          "z18GPKCLZ/7xOjx7wPhBul1NcYUAWNiKxSgqI32Nevr4caREzMqAADwv6hetPGnJ3xcP7qZ3tQvQ\n" +
          "yR3PNbCrSXt0MWumjXta2qtb2Eco+ZTTyaOsNh6u5aol4D4PsX1xu8eX1ecvU/rW3yrgjIw7EGn1\n" +
          "0Sb9eQWdHsn69CyPenN6K7a2DHhKywX6Jat3mjdu7wMBINwty2eoDRqX1NixcMAURjV26OuqMYOr\n" +
          "bTpY3/ApH0VSbu/vDvK1Adv2yOAG1FuBY8WH87+zHz0pFjySTLOPF4G8ZeW4Hi32X3+eoaqBo2Sk\n" +
          "YczZnGZYsW6Z+5dfSR4O68sZq/Oj3B541satAuqp47ZopoweyouKrCQyn3I4/A87IWgHggWCRxo5\n" +
          "BI80qheLV+u+71MMmTl9sAE9Xe8zvMFwTCssRpInOjhj/vluElvr0RwnzjTVLVj+o/VggYqnUPiL\n" +
          "Y+k0EwxQVYfmraxEFEGAW8117RuTO4bzc82D4FMOlwTfqBB2Htyf8Uijq0EX6gCf3UFU/t+iH8BT\n" +
          "AJ5FaDmuVdnYQn2WauSrF2I+fKddfWWxmcRTViHQL8r6zpS3rRflcvlN6BkaHAw/Ex99DUYk7tTO\n" +
          "CX1ekR5o4SOSCHmrxGHqhNgLQRfqAOPKvH+5Ll2lb+xJlasKvMna6eP3RP9lbo1dVSIBKI41rt7w\n" +
          "Txd488VEIUKsZazyAoQJXcX8RkmUNiP9T6qRr37MBm8GGjrf/OIh1aqfgi4wDDaQyM57B/vL0UFV\n" +
          "7RQIJ+rtmawc0WE7WNBBtyi7IFAce7uAkwFDk8AMVFIsQuoJI/ao0ka+IkhOYE0uLHTx+HyIEAgh\n" +
          "/n846BrDGLPz1nsKS35vlw6FqjfbfaMQRb05fT3bhOMpKRXo/r34R/M3u9uALzOuumDKhB5CzxU6\n" +
          "vIPL+vYs0cycmCLu2LYoaG2EE7J4KI8PF+uRCnlF0EUG8ZlMhGXX/oE8FX2uptBCoJ4w/HTU2zNZ\n" +
          "NdLRsHzd+4bMtfM8RaX+UYNiETNHNKjxM/snmItT2js16WP7y/v3qfNWgboi9J2H8iFSwEekSFin\n" +
          "27Fl98EhbuiJD0xaCwWSwGXuktSOttiP/xL2rePVBer7DF9lH7KfPCvFnnOw24BomKi6APfNcmiB\n" +
          "TqY0U8d+oRo3bC4pk7J6BioN4qEQEgog0mUJusYg1t0HF8BxMeSjB26RNmMLpNhP58UGXY9AcI/N\n" +
          "guWnzFu/bQ41i9hzDtsC0y2aqnwNVF3w+Eg18rXjmmljewmaNGJljd//EvqxDXYevgjqkerMNsl1\n" +
          "7YbMefaneFIZ+qQ6eM6BeTdx898aJmiSFNGjCCmHk9AvXrXcsHpDmk+n98+xgYJfhhKd3go9DrBI\n" +
          "e3bTaaaP7yzp8gTrBwffCS3RNiYd7O+FveC/4zyVlYgfHXWPqzUAJiGXVCL5S8/dUrzWL6zK3WuK\n" +
          "Zefe3vpF2fnO8z8JeGCSHpjcQHeis2raNohT2PZxtzpt5Gjl4AERfe9qCz3iqWMcZy7OhEx1qK6m\n" +
          "YFUE1dfaOVPbBV2MEFyXrkTpFmUds0AbtEiA8BQ/xMC0bTiiOfxmJvz4GKSambZeM2PCiNoYpLOF\n" +
          "iBMPNiu59HMLPMEhFKqMGdWTRu0RtmgWceUh0Aath1GDWTnDwEwf99hAWwlDfnPecj0uV1K8+tJl\n" +
          "bUZ6iqBJMuunbT+MiBOPp7BY5S4sFUCjWyjArgPf0uq0kQPq+3eqKeClbVixLtt16RceFFbCLBum\n" +
          "qgOw35zVhiRdU8ya6RO6Sp/uwupxJzUh4sTjuna9PdSdIchVhICnUoc0aaP28BMjxx/afuJMY/2S\n" +
          "Vcds3x2Kh7H+fKaqAyD0bLPjFgxB42Qq6t3XZ6pGR06rQF0RceJxX70+ItQPC4gPQtOKwf1GBF0M\n" +
          "Q3wmM6H7YvluY+6WPpTNhnAdH0MFnP6pAhUIhkyp08du0UwbP5inYfdEutoSceLx6gyPhSQeAs/e\n" +
          "gfBqCd2u+Uzwe4/NNRK6Ywmtmv4j2u1uTj1Odsr79bmumT6ui6htK9Y6ANFB5IlHr29EwYenti0U\n" +
          "kGB3uKAj9K2ga2GE7ftjrQ3L1hy2HzmhJcRCxG+czFh1AHhoQ/hZ3KmdA54B5f16s7akhk4iTjyU\n" +
          "zakKJQwL06XB/FCS2nFb0MUwACrFdQuWHzFv2pEKBZzYS5uR6gDSP1WgvAKPVIl+fdIH6smj3w9a\n" +
          "1wCxHz3Zwnro6IfeotIUyuUS8eNjLkl7dmKaEk4AABk0SURBVP2D9Jmn7vJViDzxuN08glf7xj0c\n" +
          "OerSySho1qRe3SbvhX7ZmveNWbnz3LeKsWgIiYj+6oCAkUlRif+5Jm3kHk362AH8BOanCoQ7MFjY\n" +
          "sGxNgWX3gXiCILGLT5U3X7IhK++0pFtnc8zf304QNnsEh+kjTzweDy8kvwWEkKjN4/uD/rAecZ6/\n" +
          "FFf5ycLL1sNHVTyFHI9Y9B/R6K8OwO6b0CrQ++ly9aRRPcLFfbM+cZy+kGhav3WL9duDqV6jEfvF\n" +
          "3RWQqfrCsX9/TFGcNsecsPTfWsgNRl6FQYjCAcQd234W9If1BORsKj/5crW30uB/0xg6ouHnGoMJ\n" +
          "Cdu2dKsnjhytHNIwS2ruBGY06TNz8q0793b3wERAMD25ly8d/DtJIn6TJKirJMr/8lFhUt5SWUSW\n" +
          "59Qarw/7HAiaNTkbDi/HsHT1RxX/+PwdnLNJimPkiOafD1SBYOqd5vVJ/pIaFvox1ASvzkAa13y9\n" +
          "zLTm6zRPqf/eCBpVYySKj8LPh7ajp6SWrd8ObFDi8Tkd4EPm5kVr6/15R7dg+YrKTxam8eNg2raU\n" +
          "ZoPGqjH+kK8RiZDitf6XNbPSUoTNmjTokhqfxUYYV62fb9q4/Q33teskeA3yqyOaOwhMgrAf//G9\n" +
          "BiUeMGUntWpbfSf9DCty3td9vjQNjgi3uzrpAkpqDEa844g7dzBrpo2PCPdNpjF9vX2oMTMnx3nh\n" +
          "Mg88L3ABbW26ASgKkRIxzKHSNqxjm9uDeEp5vRaBWg8c6VDxz8/nQYXD7WgaHWDXHwceqiV8tCml\n" +
          "mjRysmrUa6wd4VhdzFvyBxpzNq9zHD8thSM7btUI1Ta46suuYe08Ph8ipdI67Xi9E/etIlHZWx+e\n" +
          "JiUSeo9qVRXikBdSTxm9RzNj4gs8rbpBl9RY937f1bB8zW77DycUcHSlbfYsnvxnh8l0JxvWzgM3\n" +
          "jcdzB/15HVHxjy+ueMpgJGAyrUc1MJ8XtnzUHf3OrFQ2j3CsDvaCE62NeVu22Q4UNMeV84kJuBeJ\n" +
          "roZN3P4RF40UA56f0bDEg1CddrzeCQy8te7al8yPo8+cEaKH7hu3oBO2PPaTv8Y35N0GBm8ZMtcd\n" +
          "tOzc6x9fHxONkEJOX5cz3G+PF3luFCLt3Gk7hY8/WtnwxFNP6Bev2g/NatDtGfJzTtUsG6hEUAwe\n" +
          "cDV+wd8fDVrTQPAUl4kM2bm5ppzNg8CLAsLOBPQ30Skaf2U7TJBAyuGDrkf/6Y3+qKE989QXlm/3\n" +
          "93Se+0kMw6FoCRBQFHIXlSDFoBevN1TheMsqBIZVG9aYt+QPAzN+7NvQKIHeXFmV9TKIRvhYU0o7\n" +
          "Z+qf1BNHfBS4zImnDrBszs9DPm/IngsYgkCeW8VI3rtnedynf20adJ3l+CxWwrR+6zvGtZv+4br6\n" +
          "GwmWwbfDznRFLqFoFmyXK/SIp1YiTfqYPaoJw18RNLp7UDUnHoaBEhDb0ZPxpDa0Mf0YiKrpDTjc\n" +
          "GvOvPyWxwSy9JhhWbcgwb9j2CZ7CrVQgQRINYec7Cfg1lJUjRPKQvF/v65rp41PuN8iMEw/D2H44\n" +
          "MRp6ZfhyWegec243gunesUvea8OPja63qGFdY96cP9C4Mi/PceaiiJCI/aIJmF3SKBxILuO+pic7\n" +
          "2bRvTEmV9njygX4NnHgYxn701DsETYbqsOsoh79yWtqjYZhwWPceSjHlbt1uO3wMeyrzk+J/v490\n" +
          "iabKhw7yZOJ2fh86RTV96DjxMIjPZCFcV35NRoIQbzOcTOxO/FCsnTP1yaDrLMNx+nyifvGqY9Y9\n" +
          "h5JhR+BHa+n3bKgyOQEjGEFsDFJnpK9RTRo5jqdSVvsv4cTDIO6bhVqf3sCDDHdoELjjUzt9wk5+\n" +
          "XAxrj2uuK78qDVm5e8ybd6biLwvwbBAKaD+e4WbA4lJcYa8c+soF7RuTUwWNEmvsr82Jh0G8Fbpk\n" +
          "r8kM41dC+ksoqw2PcleOHjwk6CILAGN646oN2yw79/YCExLYYYkoBibVQcBFZ0AQ+ZQ+3VWnnZXW\n" +
          "WZzasdb+2px4GMRntiRSFisi1Kra/yXwhpssSDm4/wVB4yRWTR/wVur5huzcLPOmnWNg/it4j0O/\n" +
          "DO1edAHzRggGdGzrVKeNfFX+8vP5QetqCCceBvHZHVFgURtS9yt8kNweJHm6S1i7/dQEsEw2rsyb\n" +
          "b/p652zXlWsEHu+Iw840l09VFXH6KnR4eqBm1qSPNVPpm/jHiYdBKJs9GvFCu8VgWCJo1oiSPPnE\n" +
          "nqCLEYgxd8sYY1ZutuuXazxSKoHq5KqICDzX0PT7wI/zeJG3tBxBfk01ccRBzdRxL/AT6TU54cTD\n" +
          "JDT4LWC3nyc7lfLjIjuvY8nf19u4buNGe8EJFQz4xRP9bguGxmAAnoeqRxDhlA/oe12dPqaLuF1r\n" +
          "RswbOfGEMxSFCIJAwseaHYrUX8F2+Ghr/eJVMH1bBZEz3FdDd9g5IBq9AZucSHt1N2vSxzwrfab7\n" +
          "yaC1NMKJJ9wRCpCwWZOvI+1lO06dbWxYuX6fJX9vc6g548XFIIKOZrR74B+2ZUCidq3cyjGDp6lG\n" +
          "vlonHbSceMIZ2HlIEvGitNci5SU7zlxMNK7M22fdf6QlfKihkhybZjDlDFSpw5UH6gkjMlVjB0/l\n" +
          "RWk9QWsZghNPuEOSiFQpisP9ZXpuFUsMWTnbzJvz+0CpC+w0+IiGaJ5Sh5vSPMhTXokg4KAcNbhA\n" +
          "M21cH0FyQp2H8TnxhDNUlXiUsnrzXXgY4IFmyMzJMW/cPsxTVIp3mtt2TnRS1QDordDh8LP8xWdL\n" +
          "NNMndBE/0e5Gff3unHgigtCjdkxgyMx517jm63+6f7tJkHJZjT3Qqs0dSU5JlxSbatzQV8JhkgMn\n" +
          "nkignnwX7gdYBJtytyxznDgtJtWqO8LO9HtrQ2mSV29EgqaNKe3caXd1ctY3nHg4qo3lm90v6Ves\n" +
          "3ew8fQH31fDv7KuhEzyZwIU8ZRUImt4008ZtUU8dN5inVoaVwQknHo6HYjv4Qwfjqg3fWfd9H4Nz\n" +
          "NXdOEaA7XwPPNWUV+Ocqhwy4oJk8phc41QStDQM48XDcF/sPJ1oYsvMO2n84EU85XP5ZqHR3cAbA\n" +
          "Fc96fx1f9yd1qnGDn5f17slokjNUOPFwBOEzW4mKfy04Zt68IxV7oMXG+D3QEP2Fm8hffY7/J3ys\n" +
          "mVc1flh6pNgEc+LhuAuv0UQUT5pjsx85IYaxJ0R0FP3zgtAdtk7goJoYjzTpY79STRwxM5LGn3Di\n" +
          "4biLsrc/LLIfPSkWNG/szzPRLZyq5xrwQoMkp3rCiALV+OEvCZuH35jLh8GJh+M2ll37e1p27Inn\n" +
          "JyXS1x4QIGDrVKnHeSvZ872uq0cP6Sd5KjVizUw48XDcxrzt21WEUHh7gBMtBCqeYWaQzY7EHdo4\n" +
          "1VPG9GfDuHpOPBwYn8FEui790hgcMmn1QoNOzko9EjRrTKknDJ+rGj/886B1EQonnnCHibDwPfBZ\n" +
          "bQLK5SJosQTGdrUu5K2oxA44mtfT1qtGDxnHT4hl1bh6TjxhDEX58ExRQij0Mv0qCbHIi0gehSiq\n" +
          "9oV0gYrnkjLcu6Mc+vJp9cThzwofb1Gv0/iYghNPOOOjECERUISAz3iPCi9K4xE2a6K3FxzX8iTi\n" +
          "mu12gecamE7ndCJp91SjelZaJ2nXlFrbOkUCNOzRHIwCO0EdFYbKX3puNjyjQFSs2oBdrdWGPEUl\n" +
          "SND8EXfc/A8GJa5ZqGa7cBAnHo47UbzywlpJ1yccMMLkoeYl8Fxjd4ArKp4OHf1exgeNt68WKga9\n" +
          "tDVoLUvhxMNxG0IipuLmf6AVNG9CwbhGmMoQJCKoDHC7kedWEfI5XUg9ccSe5I2ZYvXk0e83tDvJ\n" +
          "PfNw3IWgcbI9ce0iScUH//7NduhoPBzJSIUMwUhIyu1BeHShWolkfXqVaGZNTBF3aFPUUO8gJx6O\n" +
          "IARJCc6Epf+XgIcQ7z+ywFNU8ojPZFEQMqlN2KzJOdmzT82W9urG+qnb7lvFEgJRiJ98bxN4Tjwc\n" +
          "90XWp+dRWZ+eeKQJjDMk5TLWT6LzlJQJjOs2Zdq//+8Qr8GEx1uQUolH0i3lO9X4Ya8JkhNv56o4\n" +
          "8XBUC7YLB6rJjZk5q0wbd4xx3yxCpFQM+TV8zVPsFjjPX+pn3rTDET3vrX6KV/wm8Zx4OBo0lN1B\n" +
          "mDftnGbIzv3S9cuvJKlWIkHjpOBqcpLAbqSls9/bSZBEP/mAvvmceDgaLKa8rWNMG7Ytc5w8JyZl\n" +
          "Uv/YRnSfNgwfhcDshHK5UeX8JTsk3VP5nHg4GhyWXft6Glbk5NuPnpSScinix8dUzz/b5wP3VuT6\n" +
          "+Sph3rrrbU48HA0G24EjHYx527bbDx9Nhh0EH88Co+irW8VBEjhs77xweQwnHg7Wg03ns/IOWfcc\n" +
          "bAK5Kn5MVO3df8A/XCiAFnI5J55wx/8Gc5UgtcB9s1ACxzPzhm96Qc0eLQOCqyosCJHQwokn3CFJ\n" +
          "CpHkPZ5gOe6Hp6hUZMjM2W7euqsP7inSahBfo6KnNwqCCV4vErVu+TUnnjAG5pnypBIfIRIx3s/D\n" +
          "BsB03rR+6z+NOVve9twoJHhaNVQH0DdVG7zlwPq3WRNK8fLz/+DEwxHxUDYHYVi3cZ554/Y/Oy/8\n" +
          "zONpwD87zu+Pf6+wc22API/RjLtjY//+7nBebJSbEw9HRGPK3ZJmWLl+qeviZR6hkCNB8h3+2XTU\n" +
          "RAS6YwvLEaGQodhP/jpH8Vq/DYirMOCIVCw79vQ2rd+23n70pBZ2BX6jpN+PZjQd0XB3bHkFFqG8\n" +
          "f5/r6vSx3cUdWt+uIufEwxFR2I+daqpfvOqE7dBRLcHHIyfpndRwx3Bg5HYjcad2NtW4Ya/I+/cJ\n" +
          "ssrixMMRETgv/hxlyMw5aNn2bRvK40G82GhGBgRD/xJMnxM+2pRSp42cqxo75L5WWZx4OMIa56Ur\n" +
          "amN23n7Lrn0dwQweDwgWieiLoKHfczcw2oQXG4Oi5k5doxo7dCIv+sHDgTnxcIQlnqISkWHl+lzL\n" +
          "1l2DPKUViBej9c8FAsHQFUGrsgDGw4ElYqQc+epx1ejBL4natKzWPCBOPBxhhVdvII3Z61eaN+8c\n" +
          "47p+0z8gOCnOHzmj87kGhmiBVZbHg6Q9uujUU0Y/LX3qyRr5ZnPi4QgbDNl5GcaVefNdv94geDjs\n" +
          "nPh74SZdgAWwyQzNb0jcrrVbPWX0UMXAF2vl+MOJh6PeMW/OH2jM2bzOcfKMFMaOCBrd0YxGl3DA\n" +
          "KstmR95KHRI0b+rTZqS/pxw+8GNSJq31X8BHFMUJiKNeAIMR/dLVex3HT0sJsQjx42JxJp/WmUDY\n" +
          "NxuGaFVi1x/NtPFbVOOGjuAnxofsm81HJOnxq/shJncPwv8Qx4mQo1rYj55sYchev9f67b5k6I3B\n" +
          "ouHTPCA4EAwoLcf/rhjQ97pm5sQUUavHaBsOzCeVCht+4b5avmjKr27E5z0wrMdRS+poSkJd4Dh+\n" +
          "pqkhO2e/7dCxJpTDgXhxMYzkavBzjdGEx5tIUjvZNDMmdJf27Eq7VRafp1E5+NFRbvfNQgEealRT\n" +
          "3G5EKmK8guREHd0vrsEDHygezxfpLQmuq78pjdl5+eZtu7vDwzovLhqRKgX9ogHfbBgObDAiYavH\n" +
          "vOpJo0cqhwzYELSOJvjwwCTu1Pa448yF7iRMPK7JL1Nl8i1s9dgVUiFnvadXnePzIVIi8RIiYUTe\n" +
          "W/BAM6xYt8W8ZVc/qBHjRUf5TTYYEA1lt+PKAF60Fmkz0jPVk0ZNZvozibcaxeD+Q00bdxRSNgci\n" +
          "pNUcL1E1zRj+Xz168EtB1zno4WGG62EIZbMThuzc+ca1mzI8hcWIVCn9fTW0H88gMeTD84BIuQwp\n" +
          "hw88rZ46roewWRNr0FoGwOIRd2xbpJ4wYkvl50sGCR9p9PA3DD+M+Scaa6aO3Snu3IH14yTqjQh6\n" +
          "3vGZLeAqM82Ut+0L57mLAhL6agJhZ5qfaZC/+Q3/bEhyamZO6Cx58ok6/RzefsiJenvGq86Llyot\n" +
          "u/ZrBUkJ4Jh/71+YJKD5CHmKS5H85edLot/L6B+0hqPBYfp6+1Bjdu5a5/lLAgJ7oCXczuTTSlUw\n" +
          "wGswwZe+WzN17EAwIKyP+31XhCAxe0FUxd/mf2dcvb4PValDPI0aIYiGBDYijxernaIopJ4y5mDM\n" +
          "B289E/QTORoU1u8OdjWsWr/LdvAHFSmT+evPautM8yDgMcFuR56yChiiRWkzpvxNPal+x5oEhdei\n" +
          "/zq3r6xvzxbmzfmb7Md/bA0G3wh/eVAQIaEkvbr9rHz1peHSnux3yee4P7YDBSmG7LzdjhOntVAf\n" +
          "hqsCauqBVh0CnZy44jkaadLH7lFNGPGKoNG9JxfUJUHiASTdOv8s6da5raesQuApLI7xWW1qUiy2\n" +
          "C5ok3+LFRLmD/gOOBoPz/KU4w4qcg5b8fS0pjwvxY6LR7QnadIvGC8WblTiBKn/pueuamWkpotYt\n" +
          "aEtyhso9xROAHxvt5sdGQ9tpgx1gxOHHdeVXpSErd4/lm92pPosVd3ASIg39AY1AJ6dOjwdpSXt2\n" +
          "M2umj+sqfbprjSqe64IHioeDw1uh4xuyc9eacrcOw3kUsHNKZCBXg6qCARYrbhUQtWvlVk8aOVo5\n" +
          "mLkkZ6hw4uG4JyAa04ZvPjVv2vGG68qvJDYObJTgL+OiWzSkP2foLdchQZNkSj1xRJZq3LApPI0q\n" +
          "rCsrOPFwBGE/eaZx2dt//9V16RcSN6PBToPDzvTvNOAdDV5opFiElKNeO66dOeFpflJCyBXPdQEn\n" +
          "Ho67cPx4LrF4wuzrlN2JBIGEORMRNHiuqdAhn82GFP373tLMmNBZ1K5VadDaMIYTTziDHS8poq6q\n" +
          "DOCoVvrW3276HE7ET4ilvzIA/T5hDWoixU+0d6gnDh8g7983yNYpEuDEE874YJwF30vU0QwyY962\n" +
          "T50XLpPCZk2YqQwAWye9AQmbN/FpR6e/p04b9VHQugiCE08YQ3l8UKhrJcSiOtl67EeOTQKfZ1p9\n" +
          "A+C5xuXCRzRoQ9BMGbtTM3Piyzy1MuInP3DiCWf8xzZeXbxCb3mlwH2rWE5KJPTa1UInJ5+HFANf\n" +
          "vKyeMuapcEpyhgonHg4M5XKTyOslQunGxxD+7mLI1UBZjaR7qk41dkh/WZ+eR4PWRjiceDgwPI3K\n" +
          "RaoUbk+RTUCIanFPqnYan9mKZ9iIWrfwqsYPT1eNHJQZtJYlcOLhwBBSCSVs0fya86crLaGxrEZH\n" +
          "N3iuAYeaCh0SJMYjddpIfyenXMbq7mJu1iXHbRQDXxhN+LyIcrqqd1Oq+nU8xWWI8niRZuLIPYlr\n" +
          "Fsq1s6dMYrtwUIPceShKEPRnHBjZsz1OKke+etqQlddR0LTR7842/0ugk7iyEhEUQrLne93STBrV\n" +
          "s6F1FEeeeO71ZtbkvyVJrqXiAcR+9OdOlNN1yZi7tSU/SoNIudTfclD1TEN5fbh402c2g62TQ502\n" +
          "csC9Ztc0BCJOPASf74U3sFZ4vYgUC431/TuEO3Gf/e1xUeuWHxlzt7zlKS4lwWMNatDAmoyUSZGg\n" +
          "cbJXNerVPzxodk1DIOLEw09OuIgIolfQhYdBUQjcKXkx0WHXFxKOqKeMflc5dMCfbEeOP+v6+doE\n" +
          "r8kUz1MqS0TtW30u7db5FAQYGvo9ijjxyJ7p/qYpZ/OJoAsPAVqFCbkM8g5/f/BKjgCkWuXDR7L+\n" +
          "qEEeyx5GxEXbJN06nxI0b+LFtkPV9TQjSdwrIu7UtlzcqS3XFctBCxEnHqjzispIfw7qpSi74+EC\n" +
          "AldTgxERQiHSzpnWLuh6OOPzIUIiskXUa25ARGSeR/bCs4ei5kz9yn2zEGezMf8rooAxXnkl9viK\n" +
          "/cc7Y8XtI6tfBD+n8fneoD/nCAsiNs+jmZU2gxcbXaD79+LV7huFiFTIEC5qxGPFff4yEZMFiVo2\n" +
          "o6L+NLu7/PlnIrO2iiUTEthIRCdJlcNeWSNJ7bjZvG33Avt/Tw323CpWUg4nQYjESNyhTbmka+dM\n" +
          "ef8+8/iJcRHR1ssRWUR8hYGgaWOrdvbkSQihSZ6ycr7PZJXylHI7LzaaS4ZyMAqrynP4sTEeFBtj\n" +
          "CrrAwcEAXGEoB0ct4cTDwVFLOPFwcNQSTjwcHLWEE0+4Q9WNAQhHzeHEE87gSnA+l6MKUzjxhDEU\n" +
          "1LaJxeaGfh/CFU484Q7XNh62cOLh4KglnHg4OGoJJx4OjlrCiYeDo5Zw4glnqkwFOcITTjxM4vWJ\n" +
          "Q/rpbg9CYjFnlRWmcOJhEEIkNCKvJ7hFvLp4vYinUV9jzQ1hGZx4GISXGFtAiER41EaN8XoRIREj\n" +
          "fkLcfnbenciHEw+DSJ5of1bYorkXDEhquvuAKyohlSJRi2aceMIUTjwMQioVlHr88HSf2eLffaor\n" +
          "IIgT2O1I8Eiyo6GZp0cSnHgYRjlyUKZq7JDTYJPls9n97j4Pg8KTqZGiX58vHrKSox4hKM7aqE6o\n" +
          "/Og/mw2ZOYN8TifiqVSIlErwrM67rKWqQtNgpSVq09KbnLdECJa3bL4vkQwnnjrEef5SnGn9tk32\n" +
          "I8e7uX67QcAQKZgQHRgVDw6osDuJU9o74xd+pBEkJ9gbyK2JSDjx1APe0gqB9cixfq4LP89y/3az\n" +
          "g1dvUCAKEaRGaZJ2T12kHD7wA1Ih596YMIcTTxjgs1hxJKEhjCJkDQih/wccVM7TRQdhywAAAABJ\n" +
          "RU5ErkJggg==\" transform=\"matrix(1 0 0 1 46 37)\">\n" +
          "</image>\n" +
          "</svg>"
    }else if (data == "edvgerial"){
      img = "<svg version=\"1.1\" id=\"Layer_1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\"\n" +
          "\t viewBox=\"0 0 300 300\" style=\"enable-background:new 0 0 300 300;\" xml:space=\"preserve\">\n" +
          "<image style=\"overflow:visible;enable-background:new    ;\" width=\"209\" height=\"267\" xlink:href=\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAANEAAAELCAYAAABH6GMSAAAgAElEQVR4nOy953obSZMuGJGZ5eDo\n" +
          "SdHLdffnZ+ac3evbc2f7Y//umdn5vOmWo/cEYcpmxj6RVQUUQIAiJVGiJEY3HoFAASgXGe6NN/Dd\n" +
          "uQGW/9oz8P/uaDjpEqzPCvgfGwK25wWc9Qj+n1ca/u9/afj7sYEwBfCd/JELwvVnLASThKZsMvLZ\n" +
          "0S8CovxhqPgMASgBECiEho+w2EDYmEf4YQnhp2UBzxYQFusAQbGPxhTfSdP26lFuKwLzU6kJIDEE\n" +
          "/YygmxroJQbC2ECYaOhFBjqRhigje759JaAVSFhpOGK5IcWsL5US4ETaOBd97Rx3M6/dy7xOqL0w\n" +
          "ISfNSGoDyP9hcT8gDm8LGv47vFOm3Us08Wm+HU76AAJBvt/FfUdkyIqSoGueSOcbTrw444QzNRXy\n" +
          "J8Tj3fMoj/Jxoh7P36N8ailXcRYlEHwXwXeEiwh+OzLBRS+rh4mpt0NdP+tn9Yu+bnT7uh7GupYk\n" +
          "xss0SE0goGJ9Pp8lyh0WGj6xlojdICEgDVyRzDbT3kLHvWzV1Tk8KtGj3LdIAaAkegJxpp+a2aMr\n" +
          "PXd8mSwctNP546t0/jzUs91IzyaRaaWpaeqMfGNIGbLuHP+f68oEJQKisdsfrx8N0ej7Eza5/hXs\n" +
          "vA09O8oIIOMdgtRzRdhqqfb8nHvQaDk78KhEj3IfwnGTkgiaF3sEN9M0exVmK1FsnhycJ6u/HEZP\n" +
          "Xp/GKwdX6dJlZBbi1Mya1MyQphYR+UAgK/c+lSajjI8qSjS291h+oqJxdP39wZ9TI2QqNs/Do5QQ\n" +
          "EoNgKFFK9JszztlsO3vdmHFs1P2oRI/ySaTqwkmB4DkoQECQZtS67OmVTldvnrbTrf3jeOP1cbz+\n" +
          "9jJZPulli2lq5gCoCQb44Q+yP9X7vWpwbvTVJmx3oyWaoEQ03NSuBiwJAUQaIDX8WtpLyQsJerWM\n" +
          "juFRiR7lPoSVyFFYSwws9GP9ZP882dw5jJ/tHsfbZ2fJxslVtnoW6fksMzMA0ADJypO7b1YQJivE\n" +
          "+PMR5ZqgEFANfN7z+fHvwcq2CMP0MIFjNEnQRGhIw6MSPcqnEl60pQRQGsEYCrSh+X6k148u06ev\n" +
          "9sNn/9gJn+0cxZtxJ1uNM1jIBDTYUoFEBxR/uLzhq6Zggkx5GWjMfA2UZ4pyTZPq14jy4wYgE/lz\n" +
          "Ka6aNXmx1FTn8zPOBTwq0aN8jFzLwjlCAFGQZDTX7evV/bPk6S/74cvXe+GLncNo67ydPoGE5kGK\n" +
          "JijhgoPSKhA/hL1padQUlDIt9Vb5Yzw+wqomTPieqV82yP3lf2sqrZIBB3vCl2dzs87R0xX/aHPF\n" +
          "O4FHJXqUTyForZC95wJEXIgSs3p4nj7/12748u874cujo/hZu5M9Ac0KhA1whAuuAHAGypM/cJr5\n" +
          "mOLajYQ7U7apynUdwpHvwcr3cIFeG5uVg9QYIIhAibbXlCcLi97hi/Xg4Nfr/qMSPcrHiXXhBIAw\n" +
          "CEjkZ4bmutaFS56+Pohe/nM3fPlqP9yOOtkau3fgiTo40gFH5JATUcQgQxfqPb7c55DCpTSUJxIS\n" +
          "YyCjGCR0REOdLC16+1tr/rsfNoPd324ER/CoRI9yV6ne5Q5rkYtCo3GTmGYv+9nKznmy9c+D6MUv\n" +
          "++ELTiRcXWWrkJk58EQNAumAKwHkAMeT42vMJwZjjYRH46m+CTKS0CC0+8MWKDKsSCkg9Gs155wt\n" +
          "0I8bwc5PG8HOsxV/b23efczOPcpHyNCF80SGM5yF2z1Ltv6yGz7707v+87eH8dPLTrYGhhZAYRMc\n" +
          "oaz1UTiWQBjIe+70SZtd+47h64O3xmAP4xuOprwxd+MKK5RSCgb64MvzxTnn8Kf1YPfftuvvfr0W\n" +
          "vFubdQ7qnjyDRyV6lGkyuLdw5J8BALW4R93MQLMbm5X9i3TrH/vR8z+97T//20641b5IVuPMzIMr\n" +
          "GuCgshZIlTc05TGHlUl55htkmt5UZSrKefynKjmM0iJmg0cKAH1w5fnsjHOwsezv/Ho9ePO7Nf/t\n" +
          "03l3v+WLUyK4gm9diWjsX7jlNfjeZKQkgsN/Sxh1GW8LRBvOcCiTAah+RrWLMJt7c56s/u0g2v77\n" +
          "bvjs1X64eXiePIFIz4PCOnjCsUmEMgaCCkT63mSipXufYAFNB4iNAQ2Jr0SnMeOcPln2956uBm+2\n" +
          "l7w3Ky3nXdOTJwKxk2SUwHdjiehDz+t3IBMKmQijCmStD2KeRMg34adBNzazb86SJ3/cDTf/823/\n" +
          "6T/3wu2Ts2QdQr0EBE2Q6OVJBBxmmkcVaAwUd5PVqHx+kuCYmzdpO6pYnvEkRmmFYhsHJUKK7lxD\n" +
          "nW2sePtPN4J3L574r5dnnTc1V+wJhDaRjZisfNNKdM0VnnJdHqW4o6r33jVLwShm5B4ulABuJzUz\n" +
          "B+10+e8H0cZ/vult//Ftb/PoOF4LQ70ICHkdyC0VqCzBFF9ajUTufE0maceYTFPASVJ14zgOygy7\n" +
          "cd2GL8/XFt2D32zWdn7Yqr3dXPHeLtTVvkQ404YSY8ioYmH4ZpUIK/47iuGLj8ZoVEo0i7HNi5Q/\n" +
          "J46tKS+TGP6XILNFRwRP2iDGa8dm7uej6Mnfd/ub/9rpb+4cRGvJVboIhso6UOH7DYIoejAnfwAr\n" +
          "IouSLZIIeTqbIHI9ySjt463VYP/Xm7WdX28Eu/Mt58hVeKEEhIw65bXBLRaHb0eJiiYQKnw3634U\n" +
          "i+C1RfVRylNmwwBTKoqh/H7KCGJNEKYGwowgSg1EiYGEm3wQlDbUvAzN0quDcPPn3XD78CjaSNrp\n" +
          "CiRmDhxRA1fIgRtXutFDD64Cyf4cUtkHpLKtonDoMC+oxkU9yFDkuvJqfs452Vz1915uBm9/Wvff\n" +
          "/bTs7dd8eQoIXTamkqHpEsGR35oSFTJwdAsFUoh3zf98N2LvbZPfV9x3xgrELd2sML3UwFVi4CrS\n" +
          "0I0NdCMNvdhAmplGPzGLlx29vn8SbeweReu9q3QFUjNrsXCsQDYTN8DCUeG+TXbhbrPCfYpt8Jqb\n" +
          "V9SDrBUi0BArR3RmZ5zTrbXg4Met2s7L9WBne9HbX5txTpXEHti1Jj8Ydm1LL/Wbd+fEowJNFWuJ\n" +
          "qigXyq1RboUIOrGBdmygE2vmTJDtvvY7/WzptJ2tn14kG4zIPjtPn6SxmQOJNVBCFXFQ0ZdafPF7\n" +
          "7u/PIlU1ZoVjNy4zeTYuMxkg9uo1eb625B3+arO2+4ft2s6LFW9vpeWcNF3Bqewk//D1G+q7SCw8\n" +
          "ymQZua+q8RG7doVCpZpsU2cG0Eg0LV719NbRWfL84Ch6dnGZboR9vZwYaIEjfXCxSGUPLFCpQLeA\n" +
          "DYzJNMtStSbTthmRYiP270tHsiymcp9QShkI7Ac1dbG86B2+3Ah2/n279vbfN4KdjTnnYC4QXFDt\n" +
          "ceR07asL+S7qRI8yXUbO0aAmhNbv574gmetEHQAWjaanUaR/6F6lL9vtdKvTzVaMhha5wgdPCgso\n" +
          "VZUgdOJNPiX9fO9CuQaWmbjE5AqE0Pd8eb686B4+36jt/Haz9vZ3a/7Oj4veQdMX577AGxUIHhEL\n" +
          "37dMbJwuQKWOQghcFJEWXpjRfJaatV5PP+9cZS/73exZHOk1bYDduDwO8qqZuFKJvvDpHS9tmAHX\n" +
          "V5FIgMjxZHtxzj15uR7s/X679u53G8HbF4ve3pO6ZIR2p3DjbjySRyV6lKFQSaGDoCSgq0RdCjOX\n" +
          "pGbjvJ0+3zuJXh6cxs8vr7LNKKMlEOzG2YJqngrNIT1UpEm/tNDQtFaSCHkcRKApBke0Z1rOybNV\n" +
          "nzFxb/7n0/rrX63471Ya6gAAuOGOeeX0+47jUYkeZSBYYkPzlDB3p3Jv0MbFVfrs4CT+4d1h9Oz4\n" +
          "LNkIw2xJC5wBJTxwEK0Ll8v1jp0vIzT49TK9bS2QdeXYAsXgystWU3Fj3c5vNmuv/2O79vr3q/67\n" +
          "zRnnoOaI8yIOym6z949K9ChltGDrHgQoDBknjGm209crRxfp9t5x8nz/KH7OCnTZzXJIj4ce+ELk\n" +
          "xTgYJhKu6dEXkGoyvUQk5GQjbIFSENCt19X5xrJ38KvN2rvfbtTe/Ljiv9uYcQ5anriwwNNbKhA8\n" +
          "KtGjDAFkTC5ilcmPU5zpR7a9e/ufe+GLn3fDF4cn8Xanl62Cse3dnM4WY5Ceh3AuxypSBRSDXTjO\n" +
          "28cmAYSO66uztQV3/7ebtXf/8bT2+jfrwev1WWen4YnjShx0a3lUou9cynuOLREh+prMXD/Wq2yB\n" +
          "ft6LXvz1bf/5271oq3OZrWpu71bcnSrkQIFwBBM3noP+9Cd3urKOu3A4UKC8O5UVowuuOJ2fc/Ze\n" +
          "rgVv/m279ur3G8HrpwvubsOXx4agLfHmTNwkeVSi71gQ8rKOh4ikQYUZNduhXty7TDdeHUXPft4L\n" +
          "n7/djzaPL5InFOtZcDEAr4D0yKIxiIYJiS8u424cK1DZnWoo9H1xGcy6R9tP/J0f14PXPzzx32zO\n" +
          "ubuzAbc2gG1tMCLv2L1Lkf5Rib5zkYDgI7gJUqMTmcU3p8nGH3fDZ39823/+5iB6enaZrFNkkdl1\n" +
          "UEVvEOfA7z1lcJsO1sqb0+KgWGeQUV+54mJxzj1cWw92fvO09vqHteDV6pz7puGLAyXgkoGn2hRY\n" +
          "y2s/cbM8KtGjOAag2UvM0t5FsvnnvfDZ/37Vff7Xd/3tw7N4PYv1Igho5shszC2QxLG2hik9QR8j\n" +
          "k9isrn//qAtXVSBOC3AxVVMPBF60Gupw44n/9ldPa69+s117tbnkvqn78sAQnCcZxY7Mqe8+ZHX4\n" +
          "drFzWHocj3KDCMPNdamZPbzST34+jrf+vBNu//Vdf+vtUbQW97J5QGiAiwXFVeHGIdCDceFgQio7\n" +
          "tQ/DtSBXiiuvJo+fLHk7W6v+6xdrwS8bi97bmbo6QgEXcWpCaStKwoJKP+SW+XZR3I/YufcJJ6b9\n" +
          "Xmqau+1s8W9H8cZfdqOtf+2F2/sn8VrcTZcgoxZ4wrNohJE4iEbjoC95oodQC7T7lXenWporB+Fq\n" +
          "rq6YJ27/2WrwZmPF/3lp1nlV98WeI4FrQaHtnTLFILgPnNb1zSnRCKDyUZGmCZ8WjwBaRx29/LfD\n" +
          "ZP2/3oZbf96JtneP4/VeN1sGTS3Lke2OKFDFgaqYofdZpCn8IDfLRFASTIyBoILM5rYG5okjaNcD\n" +
          "ebyy4O5urQWvnq75P6/MO698T+wQwVmqKfTscBac8BN3k29KiarWJ9UA/XS4uEhRARh/w1Kisako\n" +
          "kQx52Efo3dBaocTMvr3Invx1P9748060+eogWj9vp8ukTQsU+DZNVZKMIFZmfj4QGbD0FG5c3uKd\n" +
          "oaG+UOK8Xpf7c3Pu65UF95eFGfd14Mk9TXDWT0yXu1NdV4CnRhaHD5JvRonKNnBR8I5zc1mcge3Y\n" +
          "ZE+37gA0PAT/G06lUMF8qwuIWGpbGYruZy6X6Lx0YgiUMVC/6pulfx1ma//cj7feHEQbx+fJShzp\n" +
          "OUCogSOcSgw0/AGiu3EYfOoDLGUkDir6ghLSQlPkOaLt1+XR7IzzrtVyfqnX5C+OgzsEcJZp6qUC\n" +
          "bIuHLtrhB6xQH6hI384tVdT+ZOEasxXiIc39hOx9sFBDcBWBr75dU1QaCsZXxnz8GmxzXZgh9DM+\n" +
          "JwQJK5XGRpiaxfO2XvvrbrL15iDZPDlL1/q9bAGIORKwQjKSf3UB6ankwW5xHiehuXFsRtCHda3i\n" +
          "yHupjYMY0hP5SrTnWupofsHdWV3yXi3OOr/UfPlGIh4hQI/tqajyb9zI7Xg7+aYsUdnJWlqiywig\n" +
          "HZH1RrhjeT74tn25MjmVabBW2E72jgl6GUBPA3QTFL0E/KsQ5s87ZvXgJN18s59uHp4UCmQMzwrK\n" +
          "a0Fuxfcd+IjXfvLzynjpaMCXrXnlYLrfnu/Ls5VF9+DZerCztuS9m2uo3aavjn0XO4FCCpSAuotQ\n" +
          "c4Sdas5cCUoWpa8PxFp8s4kFXZxbtkbslfDzh+TO35eU95bN9Ory/rJ/owasRRnNn3bN+ttjvfVm\n" +
          "L906PErXz9vZcpzqGRDkA0+4c3BYUDVfWHkmWTEqDnBItqgZkQC+vGjNqOPtJ/7u77drO0+XvP3A\n" +
          "laeuxC5KINcR4LkCAgchcATUuGdKMoMR2vGYogz9vnclmiTfe4dr3t6ANSJYjFPYuOiYF3sn2Ys3\n" +
          "R+n25Xm62g/1HAHVwAFniIkr0tlQwaJV6VGrct3dmrADd9gerl20kqnOckoOWxvyOAjI0v1eNGac\n" +
          "o9UVf+fHzeDdv2/Xdl8seMdKYkcAaOaS4DqQKiyPYxm90HopsiSmLJSUkIYsx7eQb5rtRxYt/0oM\n" +
          "BxF861JSqvHxugrA04CZBjfSMBensNbumednl/rFyUX27OwqW++Hep7I1Fl9LCKhVKCHwxI3lPFE\n" +
          "As9RzSBGKa6ClnOy+STYf7kZ7PxqPdj58Yl3+HzWa5eI7GxAplaJgwrahfGY6NESFVKeLDGysH77\n" +
          "Ul58Xll9RNQEQRzBTBjD6uEFbb86Mi92jjUr0lYvNssApgWSPFCA+cjHyil6aCw9hqqJBFakBAR2\n" +
          "m3V1tvnE3//909rOfzyt7/z0xN9fazknnsRu2RfkVXMRI48KAP0DD/kRO/cNSpnul4b1COaiFJ4c\n" +
          "tenpz4f0/G+75tnBsdm86JsVADMLDtQY8TLgicPqXUU48a4a58y+MwPPrWTYG2RjMxglGWG6X8SO\n" +
          "CuTpk0Xv4HebtXf/57P62//YrO08nXOPWo5sT2vv/qDa7w3yqETfkGBBb8vuqyFwY4JWN4aVoyt6\n" +
          "+uYYXvxr3zz/5dBsXl2ZlSwjVqAAJNufQdGl4sQ9MG/OQEn1m+PiAEMnEBdLC+7h8zX/3e+3grd/\n" +
          "WK/tvFxwDxcCeYm5AlkrVNZjx33Uac/vKo9K9A2JHVwnLeWVlxlqdiJa3r00m/84pGd/P4AX707o\n" +
          "6dkVrEEC8yC5oArK3gGmQrI4wEpRXhb6Um5wGdzlFFujY08MRL4nr5YW3JMXG8Heb7Zqb39cDd6s\n" +
          "zzm7M748dQR22elLC2N23xCwRyX69sRDhJkohaWDNm3+7YCe/nHXPP/nIWyftmEdMlgEgQ1QVoVK\n" +
          "/H9BOJ+3po6Ms78ryHRS8Dl1sveU7Ybv40C588FbZElGHNGenXFPXq4Fe//2tP72d5u1t1sL7k7T\n" +
          "l4eIcMllsvG2oCm/+EnkUYm+LVGGoN6LYfGwQ5v/OjbP/ryrn/91j7Z2zmAtinDBTu9W6A5G38NY\n" +
          "HPSQULtUOGRle4OGFJXoBk11trbiHfxmu/7u37fr735c9XeXms6REniZZBQKCaTkaE7iPp3TRyX6\n" +
          "doQxlbVuAvM7bVr926HZ/vOeefbPffN07xTWwx4uAnBvELiDVDY/DE5IZn+hRpJRssUh3W9sOeMy\n" +
          "FBg26+pyack7er4e7P5qI3j306rPdL+HNUdcciKBj4aKxaAEXOCjEj3KLYSvYz0zML9/RWt/PjDb\n" +
          "//udefanXf3s3anZ7PRwBQzMgGKiRczVrVQUyhlKCpKR0V+aPKB4VO6ajavUcAGuWT4ajj2pZOKS\n" +
          "nO637svLJ4vu0YvNYPfXW7W3L5knbs7ZX6jJM4HYM4asAomicFrFqD66c49ykwgC8A3B7FGPnvzr\n" +
          "1Gz9967e/v92zNarI1q/6NAiMOE8Ey26TLQIRXs31/EFFUo0/PpBQP8FLdEAt1RA0Qli5cqrhRnL\n" +
          "Vrr/Oy6orvk7G/POwWwgS77szMhhJIRjhu3REj3KNOH7w+lm0DgPafHnU1r/477Z/tOu2f7l0Gyc\n" +
          "XNJymrAF4uY6QHBhODdoAMgejxy+UEBk601VnjhLMsLKlLhKdGdaPD/VPfjVhr/zh41g54cld3+p\n" +
          "rk58iYOxJxZwPmX3p7z8SeRRib5ucVOC5lGPFv91Ztb+uEfb/7Vjnv58QFvH57SaRDQPgll6UOZj\n" +
          "TwZAuuKWE3mvA44rEg2bV0c6P+/QzTpVrkEiqMDEwSAbl5QDiClxFHbnZtTZxhN3/6fN4N3vNvy3\n" +
          "v1nxdtZnnMNZT1zIO7KV3oc8KtEDl2rtcwzQzMnpWjui2Z22WfnTodn4zx2z+fd9s3F4YZ5EMc0C\n" +
          "INeCcgVyqnpSdtVwCkvm8AasjGX8bAQKFUerrIhWBhAjQq9ZV+fry+7hr7b83d9u+u9+WvF2Nlus\n" +
          "QPLCqRRUv6Q8KtEDFKq0c5sCb8n3lrZU0vn+Yp7Obhx2aenNCa3/fc9s/n3XbO6fmiedPs1zosGi\n" +
          "st0ib1cl4aACFzTyqIbhnynXPd7aULpxjEggCP1AXi7PO8c/bPi7/75de/ebNU4kuPtzvjxVeHe6\n" +
          "3/uSRyV6gFIi/XUx1Jp52LkvKEoB4rRoaSbbG7Swf2HWfj4wW6/2zdbusVm7vKIlyiDnSCgtUE44\n" +
          "nx9oNRayVkgV//Ij4yGuQ2uEMEQtTGrNhnG37hZdq3l7eYmLy7cuLVA+uY6xbpEbyMvFBefo2Zq/\n" +
          "84ft4M1/bAVvni15O0t1Ww9i0vloEi7uS8ijEj1AKdu8syK2DrP80eMu1QQgSakWpjR/2afVnRPa\n" +
          "fHVgto5OaL3TYQVilh70LG7BLREJY0QC1gKIXLuEBCAFYAq3bgARKDmk7tkilZzZeSbOjsBXnmjP\n" +
          "zzrH22v+7q+2/Le/3Qje/rTs7S40nCNf5fWgh6JA8KhED1eotETlbN7ctROZAb+bwNxhm568O6ON\n" +
          "14d66/WRWT+/MstpSjMgmKUHxCATJ6ohzribJouHKh6yuDfp/ty6QUMPDZvrbGsDT/CmBJToNJvq\n" +
          "dGvV2//t09q732/X3rxY9t6tNNWhI7GiQA8HWvGoRA9URm7jwooIgQEAzfdiWNu/ZFCpfvbzvtk+\n" +
          "PTPrV33KEQnKRkK5PozEQTSMeQa1IFG4c9VHOlQ4a7WKvZiGd6vKTT0GdvQRDl3BqgLlq0QCEq/c\n" +
          "mjx5suTt/XorePM/ntVe/W7Df7M+4+w60o496T2UOKgqj0r0QKUkXpEF3QEPb+CCapTC+nmPnu2d\n" +
          "mZevj+jZm1Nai3q0kBIULD2cSMDriYTqk0GsUqa6WXmcXIFsbGSKbaqP28gtUuCDgipUzWwMEjtQ\n" +
          "l6crS+7ey3X/ze+2aq9/s+a/3V5w91uuPLVjUYDS6V/85eRRiR6wMIgyEIAGwU0TaPUSWt6/os3X\n" +
          "Z/Rs55SeHl2ajas+LYNmwnlwbftmNRM39X4bU6JBgkFVEgzXPvThUq3pUoESt5m4YuwJ8Qh8eTG/\n" +
          "6B7+uO7v/HYzePPDE+/N2qyz1/LEqcwVKBnu+8NqU35UogcqiAPGVi8yOBOm3BtEW385NM//e08/\n" +
          "3zk2T887tAa6UlBlVLYcy1TDeMmHKgSMxQ3JyiM4uVAqUlpYI6hYpCoJwQ1+2ySCkSG5Gw7y9gnl\n" +
          "7d2GeuCJs6U55+Cndf8tu3B/2PRfbS04b5u+OJBgEQnRQ75Wj0r0AKV05diuGIJWmNLK0ZXZ+ueR\n" +
          "efHfu/r5n/fNdu+CVuPUjsCv29Y6t6JApUy1JpSnsq3JKjJ17M4JJ8/U8QPNMKtHo8HNVBn/vXFU\n" +
          "UZlyzAuqKRD1wBHnsy11sLXivv3Dlv/q3zb81y+X3HdzgTwCgMuYTMKZ8JyI9Ybf/oLyqEQPUEQe\n" +
          "A6kUoN6JaX6/TWs/n5jtfxyYp9zefXxunkAIcyCgBm6RSFB3JRmpZt7KVLdTPDj0YJdODxVpkIy4\n" +
          "g4y7cbqE8xgNGbOV4lWzpY7XVtzdH9b8Nz+ueK+35p138zV57EpsZ5qiiACk5N17qCr0qEQPVVgt\n" +
          "GmFKC3uXtP6XffP0j+/M83/sm2fH52YTbByEXFD18ua6EpldTWXfJEXr9yDrVhRe2aUjN1cik+XR\n" +
          "P5UWSdwyS4d07W4nGs5PtWNPTIQCr+Yb6mRzxd19uem//mnN+2V93nnV8uUuN9fxBO/xCS4PVR6V\n" +
          "6OEJX5NGZmDx6IrW/35onv7XW/38j+/0050T2gjzVHbLJhIcrPJlX5ebegCqLeBYSXdbl87lilRu\n" +
          "ieyjLL7e9IWFjHdRDBIJxdgTTTEAtOu+PF6ed3Zervmvf7Puv9pedN60fLFvCM6izMQEgtRNsOwH\n" +
          "JI9K9LCEo5qgn8HseZ+e/HxKW3/ZM8/+smu2X3Nv0BUtDjJxqmhtENMgOHeV0hq5uSsn2RqllQTE\n" +
          "HYuvpQtXsvTk9aBMAPRdX57Pzqj95QX37eqC82p5Rr3hJAIinMeZ6RsUlvIh+EqGDzwq0cMRi8pO\n" +
          "Dcwed2nll1Oz+ac98/Sve+bpmyPaPL+kJ4aR2QoCUMyXDaOJhEn8T7e5B6tJA1GgF6qKZF07Gmb1\n" +
          "oCzATvxyuva7ekBzlYGBsOaLy7k552iVUQhLzi+zLfVL4OJbiXBGBD07fJj5SCx712Tau4cm35US\n" +
          "TbzsD0PYngQAMHvWp5VXZ7T5n7vm2X+9y3uDzi5pJU1glvm0B5AeiUNg6bWUcyHjd+A1/psKKHUA\n" +
          "Ni0Kr9IFMIVbx9uZAqo2KeU9+MoyBV4CS8tMnJ2fGnqOuFycc4621vydrTXvzeaS93q2oXaUFEdE\n" +
          "Fs5jhPVQ0fJjF91OD96h+y6USBRVfyWvvfUQhO8TNyFOJMDibtvGQdt/fGe2ub3h4IxW+jErENRA\n" +
          "QW6BqnHQXZjXp4opFKiMjZz8NWuJdPF+xRLZHx07mePI7urUhoxSENir1+TZ6pJ78ONmsPvDhrez\n" +
          "2GQ0Ap4GCjs8N8qXCL4jwHXQTrBzRalM09ToYdipb1aJxtvKxMOcJm7buzVA4zKG+YMOrf7jhLb+\n" +
          "um+e/tO2NtBqu0sLxlBjmMrG6y7cVO/qfTJWJB2QlciibuQDyDK5YIaoG6q4dNXfLcGuo3S/lmTE\n" +
          "D8T5wrxz+PSJv/PbjWDn1xveftN3Tl0BHUUEPALfKpASoBSCI9GOxFECC2s0KX//CEC9Vxmv8ZXz\n" +
          "ih6Y2FR2J6H53Q6s/v3IbP33nt7+GyvQCa1ddmghy3hyXUFz5YyQLU5PaU+7t2jSHxVgapmxwxJP\n" +
          "x+6ctqTeVpFM8e/IDmAZB+WnnCokI5nduEQClqYAACAASURBVO8H8mLZ9gZ5uz9u+Nxct/PrZe/Y\n" +
          "U+pKMJyHCAQSSLY8onDjyn8HLt2k4O9hyLerRBWedVaebgxwEZJdyO0qJ4dzrOAzXZqxe1sYADfT\n" +
          "0Dzt0eLrM1r7057Z/Mue2Xx3bFYvu7SQaSom17HDB6OQnk+601VFKpAMAxRDUSvi2EgUxVdjrtt6\n" +
          "qtARZwVftqHYcbG7OOecPl/zD367Fez+atXffTrvHq01nUuJMr47yHV8v7+8fJNKVHXf+DTz3NKT\n" +
          "fv6cxzDO+PzgkYOVWPieB8KVBX8ctn2rRFP9sg/zOxf05J8HZvMvu3rj5wOzdnxJy/2EWiAgsImE\n" +
          "8daGSffcLZE5U7ehKhSoUCpR3B5MyiWrCIa0onA4zLMPqK5sei0Fhb1WQ50/XfEO/2072P0/ntZ2\n" +
          "frXi76801YlEUbD0TNvZryEvl8s3rETsGlAxBDnvCO0nuRLxQulZHxxH4/N7vm6lwvJvxRrcyxCa\n" +
          "O5dm8ecjs/bPfbPxy4FZOzgzS70QZgApAKfK0nPt6z5gB669MvoeFXtHBQcDlQhvt4iPyvZx5oLT\n" +
          "o66kVSAouwc1KAyDurxYWXSPflz3d/9tK9j5w7q/x3ODGq4oQKVUpEW+HoWZJN+sO1f601BYnzAh\n" +
          "q0RsnRouQFYfDVVvUYv/6P0pf4+fhil4x12a+fmUlv52SKu/HJrVo3Oz3OnTLNcZwQMJXqU7FT7H\n" +
          "vVbxEwfJgxLJ4BUNpYV7Z2IYKhIPhcUcmW1sfls7nujPzTgXG8ve4YtVb++HZW93a845arnykg9/\n" +
          "GFx93QoE30tiwWZadZ5ciApLBDBUsvL5vbpzld9ipttORMHuJc3+/cis/O3IrL47oyftXoFIEMXs\n" +
          "1HGWntvKXV27a1K4agNSEzHM1nGMJEwl7V0kHEorRAiOI9PZpuquL7mnz554+9vL7s7KjNprutyd\n" +
          "ytPryvbZr1+B4FtPcZcyiEcq8Y8pHmXau5xkeF+CFUuUGZCXIfjvLmj2Xye09OqUlk86tJgxSw9z\n" +
          "JDCkR42Zr/F77ibluM1x3LhNWYQ1Y9k6GmbqSqukrcLhoC4kBPkeJiuzztWLZffkxYq7vzrr7Nc9\n" +
          "ye3dDCyN7/dMf375pout5ZUSRYNbOVmeis5kdvNUsdKn5n4vrR2+XPxWmIK8CCk4aNPMzgUtHF7R\n" +
          "Qj9mBULfFlRLVPY0BfosUk0clCsQK5KXKxIUFogtktGDjJ2QSPWajNbmnMuXS+7Ry0V3f6khj7i1\n" +
          "ITEQesIMVoBvRZW+C8RCma2zFNRFDbCXErhJfnOX3cr3rUROoRjtmOR5n4KTHrVOuzTfCWkO8nS2\n" +
          "GhDwfPGySGmNaKx5r4iP2BqJ0iIVmTskUC5QqyGi1Tl1/nzRPXw27x4s1tSpr0Qvz45/U0bIyjev\n" +
          "RHl3MmfhcrIZVpYwI2jH+Q3NDV8lPdV9Xl5WIk/l+3ARgWxH5HUjqIcJNCmDOlAx4HoSKvuuO3aT\n" +
          "qzdJJoEBBn/gmEWyaAYE6QFoxtXZHofcMikDykPTqIl4sSk7a011ttqQZy1PXjkCU+JJkZ8jDfqZ\n" +
          "5buxRGU8xG47JxeuEgJTUSLzGZQoILT70Y5J9BJQUQZepsEvFEiCmKJEX1So4tqVnN0yr/4iW58s\n" +
          "JzbhdnKZgXQFBT6kMwGE8wH25j3RcyTaoqrmdiI9YabYVy7fjxIVz3XBKtrn/BC7HwptvFy6cvd1\n" +
          "gVVZckGrxBhpkElGUhuSQCRHdrS6w/ede7+VVBSJxGh8JAq3TnLSIQaUCEoBeQp0oEA7suzqy1cq\n" +
          "Yx6V6KuUQWbMZuQIUoMQ6SGiRY1ZK6K7e0Tvk6pOFP+yIeTqir55ssF4guGOt+C0A5nqwo3/bjU2\n" +
          "gqGLB0XbhPStG2ePQqCtsxqDMtPkZNp4oI0PAh0gio1FAg1Xq4k/+xXKd9eUV0XplyluRi8oHNaK\n" +
          "7iP2te5ckTCoOWA8BZkrIZYCQkCIgSAFA86AAhtGSD6+oIylCAdQt0onrLVCuTk3OsEoRdWLIbiK\n" +
          "dKMdZfWmJHZZ44yptguXdhwA/jXLd6dEpqJAwgb7CC0HwJf53+NJhk91oVmJ3MLkUYa65WFcc7Hn\n" +
          "KeyAgC7fZKBJgYZhN9o4i+kXVaYqmqECUrVBZaFIGUGmhehH2j3vQ/2oq1vHvaylFQQeYsdQ3nQn\n" +
          "xKMSfbVSekOlpeGGL7YOLReg4Yyluz/xQTr2fstvG0WkF2oQLdbxaq6G5yceXvQSmrWWSINnlUfS\n" +
          "qBm6aYeugUmnPL8rMHX8NwfuXUmjVZhvqXKQKjtzGWInytyjDrbeXtL8bFPPZxKas55qexJDT2J+\n" +
          "HkaU6KaDe/jyXbpzVgqUN9/cTIhRV4WlKCwRfOJLa9lMC8uiALOlGvZXZ/BybRZPz7t4Fse0kMVQ\n" +
          "hwwctkWgPqbZ7j6lDGYqaAZrXvJGPmNA9CLhHV6Z5qtzXGjWadFxad4VdOkrEbuOMHaxGmmze1Si\n" +
          "r05GOpnZjy/aYwTnmUWRSav0u32KSywqrpkvQS/Wsf90Hi8PlvG4G+JxP8aFk4yakNnOIX8w6aQa\n" +
          "H5XyYO65wiphyfmgctR8gt7hlW7Vz2ixXoMnszU4WapBW0mIHckzVjH7Vlw5+B6VqNqsx+nWRKMd\n" +
          "oOVZS0HA7kYJTEW4H0sgBZi5AKJnC3jRicVxmNDBVUTz/QhbvR64oEFChk6OXhjnlaumDgfEIKOa\n" +
          "NXWfp2ji1O0nfXbMV8TCIpXYKq34nDpnXdESZ3q54cPGahPbWzPQ1y1bleUJD51PxQ7xEOT7U6Jq\n" +
          "zci2jJOtGVkqa8xdDO56LRXpUzXrYQU1zl9Z9zBan4F2nOFxLxazp32aPw9hJtLk65A8SAs7VFIE\n" +
          "PwgoEFxXxLKlXJR9TwKyjJxOBHVq48KOT2vvZrDzdA77T1oQ1z3SjuCUPva/FejCd807R4UipTpv\n" +
          "lWAQqmNy16u0Qp/qKo+XeDwF6WwAnc1ZPLuKxeFhj+aP+zAbp6Z2mUEtim2mzgNtcd1DRPeklDd+\n" +
          "yaJL6dIVQSbaCpgwmQg6fZw7ujDhqxPorzSx3wogdB2IluoQu8JWlpJvwSJ990pUfU5jiYeyAPup\n" +
          "7s9qTxHD+AKF3aU6nG3Po38aQfM8xqZOIXiTmNphSkqnVjl8S8SmxlLeI4XQ8aOZ5p/RxKdTN5/2\n" +
          "+vjXYdFCjoVCC4YqokcJtM6vRPavI0h8FyLpYCwVRAohXWnYT18BUDhhWfiq5LtWomqf0VjTnH2M\n" +
          "xEaf+neLLvHAwc5iA06fL4pmJ4GWTijIIqqFETgXHRCkSUIK7mC06iTuPPzC9yBVFIn/yPdVQYZB\n" +
          "P8aZ/XNKpIRQSogCB8KmA3HTh4wTLAItWuPBjZC8i3z3NMLjULXPLKxIYdOD9noLj5MMG1kign6f\n" +
          "Gt0++Zk2Tq9Prub4CEnarcc5Fx7aGo6lEtkdVJRC7aoHc3uIkSspnvEZmEph3Yd4uQHRjAexQtAP\n" +
          "aRr4XeW7V6IHIEkgoLsYwKlcQN9odHqR8HsxuYZAHZwapx2RoJQjI1Q58w4OSXlKGTelMEHBxkkl\n" +
          "7iLTlBUr2jzoguTsDOU9KBpcSLHV7kC2KxipQUnTx0gpin9axkjMUTLn2RRf/2uNjx6V6MsL33pJ\n" +
          "XUHHreFJOi84s+X3E+JBx4424KanRvViS0VVtylENW4+H0DVpcoHXm3pMGAViTQ0r7qQvTuGOPAo\n" +
          "lApCKaBXcyCqO5Byxo5odKzkwN2+9mMPSx6V6GEIo7kjV0B7qY7yxSK6mZY+GfCiGPx+TG6sSWQJ\n" +
          "KGCLVKa7JYxm7KZZiy8hZRLEsRh1jny8OIPWaRsS5UDoKOi3XOjN+9CvOxD6jlWgiDOYokCS2JZ6\n" +
          "HHYlYyXZ85DkUYkejnAhsssYvrUWKoXoGUPOVQheOyQ3zEheXIFjOOWdkjtYpqtX8Cb37UNkWgZv\n" +
          "PK058XdwqOiOjZUcSKDWjWD+8BwSV0G8EFB/IcC+I4nT331l0Qw2/Q01B8FnKJYY1u2EyGt5k3fk\n" +
          "y8lEJRrgCgtyDfENIW4fsFi3DgG6sx7KQIKXZkJd9Mm7DIUT5Q18qt0nQRk0bGtp2U4+KWP3JaVa\n" +
          "L8AKBTKBQzHUeiHMHV1A/DqAcMaHPiH0lmeg1/Ch7ztwVlMWaJ8XuotjG0CxxAO2ROXkjHL0u+cA\n" +
          "BMVq4MhhveS+6Xa/c7FERBKhW3PgdH0Gxa9WhNOJgd05J9TG62tykz4ISEgOWsoBR2Okh3CByhQB\n" +
          "VjCAOUkQW9NGpw+Le2cQ+64lp+0+TaG3MQf9pQakgYKeRWQxJz7mBXBzz7yAHyOTLVFBwzviiz6a\n" +
          "os8lJqfYhYvZAM3zBSFjA26kSbUTcC9jco5T4jY+rh/VczWiYfAAFQTDuKs1zT2DKdtMk2mfvSZU\n" +
          "+S0s60d2oFmcAZ20ISVBYUgQaoAocDGardna0YkQlqMuGyzaD3jlHkzFLHxO+6edohARXoYEVxEx\n" +
          "5S3ZMYAwHHXxEIQXp0LBqXRBRcnv9nUrvq0fsV4sN1ClgG4/E+osIucsFE4/Ndhtk4KMBCQQABXj\n" +
          "J50H1DpRxTiV+1Twm4CwC0DQTWA2uYQoBmuRErZCy00w80FOzCSFRX6TfODXUgmR64SrwHMl1HiV\n" +
          "YDqntxfEF0tcRSSPO4SJBiEloEOA/K+YoEljxzlx7RihL5hwnq//MTKkjcDkkDchICseqZKQugoS\n" +
          "z4E0cDDhByFlTgo0AiT9upTKKpInob1QR2d7Qchfh6QuIssQpPaIvPM2OJoVyVh0HQ7io4dGdDJS\n" +
          "Pxpk7pTWEIQxzJ9eQbp3CtliA5JWHdK6C1nThXjGY2iUzVpmD5noUUm0/EfgSmy4Ep9oQ0vHHZrr\n" +
          "Rrpec9CNUnB3r0j1EpBSoHAVSSUGC8PIJbqNEl3f7IYXrwtBXt1OEeyMzxABeojQR8SOENhVAjpS\n" +
          "QNcA9gRSiNXZudP26OEKK1LPlQCLdaQfl4Tg6yEIpMOxUUqqfUV5Xo+nSMhKRmz8TN907NPeu81F\n" +
          "mZqdmyLl4pvHSQywbUUR0OEFkOdRCg5kjsSs5UGy4IN2JVw4ArqZyZMND1GUGcZFLUOw3ovhxcEl\n" +
          "rYcJzfM0a03ghxm6kSEFlCfsmC224Gm7sxJ9jCUyuR3SQJashydNdzMN7SSFdpTQeS+C83ZIp3UH\n" +
          "zlDwOHdoG4IuIhi2nF8b+abJOeKzVEPXUwDrLVRGC1cwm04M6irSspsJ0D1Cy82Qkj/iOn1IouG2\n" +
          "inOX7ymDmtJCFtTeNr+Ygc/L4lUPzKsTSBIBqa8gWwwoXQrQ1F0QSoARAF2DD9OZUP0sTyJ2Ex44\n" +
          "RStHbXq2c6JftnuwkhlogAJPSHSVA0rJgcMgCvOKN3A4TXt9ohLdePGK4LKiRHEmqEcZdEHDlTJw\n" +
          "6QGd+oinkMFBu4eHtQBrgORyyO050CPCJCnWsq8lw2iKaRZxZlWkV3fwbLUJTpyCuOwJdd4nJ8qM\n" +
          "bBM4nZCUTiy+zgFvzCI9JClP/DA+QkjAS1NoXl7BskbI2I1bqUMy70PqStBrTUgCZWOk+CFCg1Q3\n" +
          "zQ3sZUje8ZVpHlyYhaMz86Tbhw0D2OSBu44LynNBOsqioZA+1QSFOypR8ZwKdy5OkKIIoR/1qdPv\n" +
          "wXn7Cs/2zmlhZRbnl+dEa7EJ9bqPniPwjBRdWg77rwydVSkrZAKg4ynEhTqYZ0sCOxEoMiDfGuPs\n" +
          "nJK8CgnBYAMEuQN83X3g5aoy7TtvKvyWLmCp5Aa4Ta/GbmmnA/T2COhPPqU1BSkiZo6gdKOFbI3a\n" +
          "kLvxD+oqqrhYnbm7sxMBXoUk+yG4JqIABNQhH8SeVwI1d37SWMpxwlm8Tbvy+07yhDcqCVMXiRxB\n" +
          "GAhDjQ5Q61xA60DBnHciWgsz2NpapubzZVHfmAe/4YFbZO8uBELyNRaPs7x5MEkyarN7s9hA+XIJ\n" +
          "PZ0JZSJyujHKDieMUxKQcXtpkUy+DYfd5zoZ40iHKjTItsRDABnMnrZJ/3MfYkdQogSkjK2rO2AW\n" +
          "GoMjeFA9SEqKfGekBC0lJEJAzDeadZv0oEAGmQWqV6Kgimm4JhNe+mgZv9CcYjC2+1OBIQ8MeEBQ\n" +
          "g44JTvpY78XYSBOoJYnwVmZAtWpAjgJyHWi7DvDFeejlh4GwJeLu2zC1jzQ1cOVJcObq6K7Oojhb\n" +
          "EM5Jj5zLGJ2wR25qwKGEchVSldaJaUr0WQ+m+HdQWxnER3ZvIYVaFIHeP4NEonXjuAM4afmQCQW6\n" +
          "6UFatE4kD+XyqZaHVj0WGhg/mcXu6py4irrQOU9NmCaQ2hWiNLuiciFuMqj3tbKNw/2HaVwBSDXb\n" +
          "vJaC1+uSv6ehBonxuyE57UWhNhYRV2ZQ1B1QroILbhIrv+ehK1K5ZpWDyYyxjWyXjgRsBmiWZlGt\n" +
          "R4KTP96pAP+yB26c2QSQZ8+OhPsr7t3kUUx8bYLLwe0dZXrLgAsRNLtdpD0AU3fItALMAg8yIyHb\n" +
          "noVkMbBK1APA6PoOfH5Rc36uRGszGP6wIi/aIZxQAsdkOH9PnjH2qL0cUFe5GDcp0X3INUtUaHPJ\n" +
          "z2aw6KaEOhiU3My2l4K6jEmEMePOhHCkkI6LyvVy2miBEOMDd+2wMn9WFnhGbSniKUGgi8AFszyL\n" +
          "XkqiJiXUPDQ1Q+SddPmWswrkWWv0IZ2HE+73D/rsbV4vs4nGPncgg0a3D9neGeh6AInnU4ISU3bx\n" +
          "6g4yWT4UjXzpte/6zKJaXt5RuNrE/o8r4iLTcGgyXIgymA2N8Ts9UmCAIYHS3qhiDPR4m5M7aZtr\n" +
          "SnHDe1NljOw9p4YX3C5gIhCdkLBjB17b2pZwFSJPlZcKdc2BjF07T426dpN29UtJqUCWgpgtphp2\n" +
          "YRuDpBXE6EPbcfCw5VOz5UNDGGj0ElNrR+AlEbjA7ROCM7B4vRD7kFy7KuI7yxduY6B52QXz5hhi\n" +
          "6VrOuqTpQdT0IFluQOYrSCQMgo4vJsoV+Q7MBRg+m4MLheIoyWDuKjaznUTUMqO9MASmcOKUsbAW\n" +
          "wB1z7SZdjI8hwpj2+iTXAcee538LW3+wWR/C8w6oXUGCUCMXjIQE0/QlOTUuHkObSeXxIcQLY4IF\n" +
          "Lssr+mocS76fUx/XFEHTtaNSeWrmRZzhwWIN6lkKjYs+1S76GJxl5OuMWNUCi392imHKk7pR77xn\n" +
          "VbnFl4zHQpMEK6gG/iuFIEwATi4hQ5nXj1oBRDUP4hQgWeH2cmWVKPqSilQ6Q1BTED9p4JWv4KSf\n" +
          "YPMiFM1ObIJMo3esyYt4vHpiYUE5UEh+CVgtXf9zvGI+uAh25XUhg1aqSZ5cEYRAZAQnF5Bm64Qz\n" +
          "AYimg5y2t6QhD821wyInICTaQ+LpFTYmcnKqL1PiTBFCQ3Ax64n9Xgz1sz7V2iEFRhvv4sq2UKDF\n" +
          "2PHhqeoR3sEkfcyJGcnKTZhbQzhckKvQII51Ywj6Mc2cXEL62oGsEUDEtFsZ2MRD5DdBe2KQsfsi\n" +
          "MlAiiZDVHYaY4PmzBaydh6LBFyRJKIgTEyQXpEwerPq2QDZO4XTtZH2ik36X18XYQ1mP2YEQ6v2E\n" +
          "dL8NxpFkmr4xrQbqmid0TULSUJh4Kh93osTDqYpjpbfruoy8aANtB+HsYkHUL0Jq9GJq6AzqOjPe\n" +
          "ZZccyuxMcncQwI/TE087559Lqr8vR2Jv6573I5g5voD0Fx/6rgN9V0HYcqE740IkPJup467Ykkpy\n" +
          "0IEgPkMnrPxf/+t/lc/toiYRNCNnHQbVSZCpBtWJyb2KwUlSOz/HsSokqnv7gSvVp4KYVL+vCi3J\n" +
          "nyNolDYVrkGlBXwpRZ5OwNkfTOcCTGc80A1XZI4ETTgM5r8SsdfOV6jRjosBIRBUkoHTT8jtJeCm\n" +
          "nLkkJjoBOYglB8VYnKxMU49/6htTrteor33Tx62U7QK8Yc6TLsGQTDN7P2JiwDgKdcvNYyQuy2QE\n" +
          "YaJBJ/r66ND79jCqSgTFKchciSbgmT2O9bmxk6K6SkBdZaCMKYhtsUgtDDJ2Y7s5dt6uyTWTfm2L\n" +
          "63LTd+KEf7H6Rt7NwgjoRIPsZISakOoO0HwN9VyAOnCRLVFqc31flxJBWdFzJVLDQ/QkCk0g+xmo\n" +
          "bj4f1sn0gJRYDNN+U84n3PB6VW61yFUW2tuYhdHrBsUACcmt8WkKyONCFQJxcsh3MEG0bNCsRElm\n" +
          "hhBJrCyG92mN5P9VKFHxGzZZLBAoUEiuygerhxpUX4NiBHGSgpdldo4Or+giz71WTs60m3xcPrXl\n" +
          "mvRe9cLldp0tkkhSEJ0shy/5DpjZALOWj7ruidhXXCmHTOBDSzPcSgwTfNRdRMfGTyhiAzLMwA1T\n" +
          "dNkqGbZIGvPy6zg0aPwcTjqnHyQfYgoqiicKtdcgdAaYaERexfk6SYkxWyJHQujkkwcz9qTKBbAs\n" +
          "C3xOJSrFpg1drh9z9i7fA5UakHFMbj8GR7NrR9YiiYHjOSlmnSYfkg276TsHN8KEFF6pSGgnpCpL\n" +
          "Fs+Dhw1IgYCug8ZzUNddiJseMugxK1b2r5EHjQsRNr5jdxUFCE0ow4ycqwjcfmSTLY4tW4iBP1GJ\n" +
          "kSrm/qbzfScZ+67buoxVJYIiPjIgjEapNaA2QBmxs45Z3YOk6UPa8EBzXxkWiG9VlAi+hBJBMdo0\n" +
          "FQK1U8RIbHnChGMkdhFs/SinoBCFewBT4qOb3LD3bTPt9fFtJr1GlcxP6WPbngrI4yIDMiNk5kBC\n" +
          "gRQ4mM34mLJVEmjdOv0VdiGVTYupo9C4EpEXikijbMegziNQlQWwgBSPxUcw5ZxWf2Ga4JTHXWTc\n" +
          "Mg7CBdvLzMktmWkQxRR2rloQ0xLP1VA3fNC+Ba5Cyt6EEl9IiezIRSJKDWSc/lXCDr/ieVjYT4Eb\n" +
          "9JwwBVdn5BtdrGqE+F4f+yaZ9plpr99mG4IxSzTYHq0F1SBi9rM1Eo/k9R3ImgEmDQ9TR2KshM36\n" +
          "3DDZ++GJDWo1cVyQKYGkOI0gkEd3i14KspOCk9lrZwkVHRu0Q2VO7MfebZ/6Zp2slDY+ior4iPlA\n" +
          "ah6YRoC67kMauMBueeoJ4DEuNJjycU8yWYkKM5TlLdW6/NOQNZ9Sa+IA3UsT8MMEPMqKizGuRHfZ\n" +
          "82nbTnt92jbXVslyZR1bYRFZiZRJUcScYTDAZG/a9zD1XLuKRwFPMcCBa/dVSDlzlp+yF5FfO2T8\n" +
          "MKVAMjXILeUOu+VxQmVsK4fxEX7Y9Zt0LT5Wxj2QaoFf24K65EXQckxwrUihcRzIXTsvbzNnsOp9\n" +
          "VzSnKlEJdtQE1iJlBhJE69px0MquphMn4HWZzomhJabI2A1ak3F09SilGuxPoxKa9LlxmbrN+LI1\n" +
          "YZsyLW8RDai0JnYP8mhKIFfHM+ZsaHoYcwq8sEZfhSINrp2dBIgmNRZqxw0SRlgSRJ4dRKofg2pH\n" +
          "lnBe2fKmrF67aed2itxp+xuu+9hmI0c1cO0GKTAukXMToko1iFCjCA0ASjANl91y0AxpKxbBe/Um\n" +
          "pioRFBciy6fJMdsPE4JwWhFrLnLCw+2l4LUjcLu5NeI6hDOYZ/te127qG/crA/8fSzS6TZ1woMrH\n" +
          "mgFnviGruRjP+Bg2XC5LQJQZyHgIGCMFdHFuqDJE+wsdzTUplSi/brZ1QieGnQrkJIPd1yQD0Y2J\n" +
          "+b2ta0cEHkF57abEtTfJnQ7+lhtfuyGri+9AaS12huOjboqir/Ooqe6isUrkQ8rYyEp8ey8yUYmq\n" +
          "+01FXGHH1XMGywFquMh/yr4G9yoBj126LLUP164OVPjYCm+4wya+eL8ywUgV0KGyBiFSna9xNRc5\n" +
          "2xOzWxdrCMMUol5Cdr5rbHJX11SOY+phfmYpXfFyAiAD6zICkwHojEgzZ4OdCqgt2w7Ph+WShZfo\n" +
          "4toNbs0pBdhJct9KBNXrds27YLdcMsa7r0EgATL6pOaCrrl5HanuDpToXhTJFluvHRYWsbfNFWDO\n" +
          "iCoBfIUm4B108jcSAiYWdJidM0nAjRIbsEqb+bHTC3A0s4KT7uBPLDe5FtfeKytxNvKTOq+IExkE\n" +
          "7u33HEwMQhxlFPZSCnsJpBa0xTcoVQzuYNIiTvzZzymlJdLFKM2ssEqpIR1nPE6V3XKuJ6Hgxj5B\n" +
          "4CYZeJwsMtqiOVTO3AnDEzXtfN4k01ZlGHsPxxRkkpuHY/dPuU2Z+s67YjmkEFrzpUDLRagUMNFJ\n" +
          "2vBQe6rA+N+DIo0jFobHVeynHUmPCK7IlckRSG4RhGqBTGWrMmMVyOuGYCm27EwaLmzKsSAVv3DC\n" +
          "eFx3sYK4IMyLebbKAigFGhKQZvls5JAI2OWOOB1eRqr5+cnPixJ5lughKFHpZtIwroU0Jz3hgcOM\n" +
          "hqamh7Lh2oQQw4K8q4i8OLHWyLGxbfVG/dQJhqnvTX3j+jYIo/uWe0CsREIbQNYWIViJUDd95PoR\n" +
          "F9B5AUk/dXw7UYmquzuyQOQv5xg7iSQkoKtQ8jAqTnl3olyZ0sy2ag/hJYijFE4wdiN/LpnkIpRJ\n" +
          "BsI8PiIu4qHgJDEH5SkRs8wkNRfiwMXEcZDb6DM+JkYFcGsC88I5D0SJqjIAYRaeBa9pvgLT9ISe\n" +
          "9VG2PL526HTz2JaViFl3PDAFjhpvE9tOkZu2n/re1DdyqQagOGFhZiq3LI+RUsOZfQtd03WP3TpI\n" +
          "lMTEkwPX7pMp0o1KdIMYxS4B47Qcy4aKXLjsp0zhBE6akhOXqdM8/Tj0sadZokkKdpNM2/6m6zBJ\n" +
          "icZdTK5BGFRZxoVlosQwsJOhQSJr1ZATDlopZNJ5JhYE/6EpUelWDlzx/MH7GCiEhosw46Ge8RGb\n" +
          "LrIjK/o8nS9lMkhLx+WlGToM+LRlAFFZaCq/cSsX70M+U8q0e2Dcsxn9fpuxK/CRwpBl7eUF3ygJ\n" +
          "GScZajk+snTtpv3KneRDlYiFLE7LQRKc+wbAjMBJLcaO3DABN8tsHcIpruj1g550cm4r07af9vqk\n" +
          "9xCqylMEN8WFSC0HOUNLkHGELR9NIwBd8zDxXYx5ZaspMAzSdfDhuHMjrnixX9ZiKrRKVOOHg8T/\n" +
          "8r4bREwJVJrHRm4/Jq+fgGvyQqwzkC1zeAAAIABJREFUAme/16zdB3znuFuOw9R3RiC49le4tpze\n" +
          "Z4Axx0dpzbVohvRTpb4/SokwB6sytMQyjLoKJDOqhgnwyESXU6i2EJtDg/BainJcJr02TaZtO+31\n" +
          "Se9dU6Li33xEIs8BYjSDVLwEMKhRofFcTJs+JC1PpE0fTSBtLaIYyvBw3LnxOF2MPTjwdgRj65D7\n" +
          "JoSUyNhIbnvxOxF6nCQCXVy78jwJuJtrd59KdN0KVWNeYaFBGUid2tYJfo8CF7KGB0ngWdeOC+mf\n" +
          "JPX9MUoEJfyee3BcCRaCzzYnypji1vJ3W/fO9rEAqsEBi5EDvi7jPu+14Ow9V2fc5E9TWhjfrhL1\n" +
          "aVvIk9qg4qxdaNBigBwFln1mtoa66WHGPrbMF5MHFxO9R8prZ5gQ0ndRaADZzcDh3rEoJSfNyrR3\n" +
          "zteeN8vd4QgnbToBHzz6x4SLhTTh5cpFxvE38z5Tjo/SFCRnVDnB4irb7mIRKdwd6ylMxCcopH+s\n" +
          "EsEANSyRmp7NiHAcIXrZAGPnJPnFUBOhQdOUaKJMfeOWn3+PjKxumLdOGG6dINFJgQnAkbnrmKaq\n" +
          "FQib9WGWTkdAoixq+CtSoVyMRBvzQeDlvR8Rt05oGxupKE80lNjIYWx7W7lDsm3CH+95eZJJGluk\n" +
          "OVOXgogzQGatEhwfKcgcF1IuptecQaLBMgYN6KVx4jdPlU+hRGAH9+aIWe2qvHWCMXaJBqefgduN\n" +
          "wdNJ0YNUbZ2oHvSk83NNpr5xy8/fIJNcvXzMvWS3TqdsjfLWCeWg8V00dQ/SJndXKpEh4BdnnflA\n" +
          "4d4bdksZ0TBQFQ7OezG5vcj2ICnbgySK/rG7WPj3yadQour7orJfpVuu7fFIMlZbOLuqGzkiJa45\n" +
          "lqyUiYA1I1JMycZ2Q9QxLp9KiaCsCLsKucWaAzmpAWXPcr+B040LsCOQY7M+CGNth+We31IDxjNy\n" +
          "Ey9q5cVpzAmTXq5+Vx6oKuvaaVsTY43JWydcyGZ9zLipT9ncCqRTbOtDlpK1L3UV2kSJ59igXPRi\n" +
          "cNoROb3YKpFTzLkbxrZVQOjUazB2nse3m5ZZHfmua379ta8f/UzlmpfxEVMDZIAMDeIrykXYGY8t\n" +
          "EsOCME4NJFxoN0VmMy+c47XdmiSfUomgGCXPlX5SymZ+eI6gaHNreUK2kY+4B4mK1olBxFt8+kNv\n" +
          "v6lHOfWNyZtMyvaUioSQu3bawp0sEoDhJZwunvVFVnPQFvMeApngB4jtoGCO77qDELhol5x+ApLj\n" +
          "o36Su+SU94+pAaxLTPAipsmdrdJHyqjO2bYXbi3vFolt5qOoM2LfgUQK5GkTCXMiCZtouV6Oukk+\n" +
          "tRKxcLaK9Z/dUMN3FNeMUh54m3Ix1roHDrOU2khc4qg79ylcsbt82aRNxhe9XKGwcO04ZrAFWWXx\n" +
          "hIzRYlgJ+9eYKjEIVL8Ki1RlhGYQCrMdeU5ejOQ0MbvkXLZIGCNp0SgMDbJoFBwpoH9y1+4j5fpC\n" +
          "yNlW1BpFZmyjohESM46RPGVLFnHgQOq5aEoyT/EFlYgvik4ph2yxn81xBHInaQaqExGjGkofO8fY\n" +
          "TdrTiYiGKWvDJGsy/t6Uj177PIxtV3VdCPJpC3ZRIElkFy0OlIyjLPI7bebc5p+0mHffUmEcy7ti\n" +
          "kVdn0DJPfzMiRXLtiDuaeTofGMwZnwbzjyb0IN1FuW4bfMBtwbA0fD4sW4BlfSJQTAuQcraViLhF\n" +
          "xHMgY8R3y8eMQdYyR0l9OUvEOK1IA4WZ7UHKhECSXI1l9nGb+gaHp2AX9aOCfeYG23lNiSbIlJdv\n" +
          "+sjEbcZ/v/p6GbvlrRNS215/i9PieJU4fdrwbHs59yLx5Ph7hd9/SqGKReLYOjNcjESSMi/WagLB\n" +
          "mdY21//YJdeWKN8p8N6jYNBJ5/VLybX7yRb9BRm0reWhzq+d76KeqTG7KrJXwZnWVOTzoD57YsEK\n" +
          "xwqclw8zILZGZKmwQXNzX6RB9G3Km5gsw8s0+VSyBmGRPr0xUzflkKa8/N73bvv5a0FuHh9xMY+D\n" +
          "1YwBqxJNzeP2ZGQGmpR5o7+WrtiKAln3IdNFpQxt1ldnhMBsT/0MnDizC2BgyxY6B32OxEfjyYIv\n" +
          "KeOLoygwUcZi7EQ/rx9xoZl8D3Tg8fQJTGqOLVlkOJ0ke0TuxRKlRUNYVnTFppqR+IwKskdlGaEp\n" +
          "Az9KyI859c2EipyxUxVCEagWVstsS+V4rt3Y1c9MWoVuEJzwpePZvGqRN7dIzAirktS2T9iclVRI\n" +
          "DmPrHLR9LDU1ADo+aJ6G6p1SIr+JyBSNiInmMgtanJ0iskSQXi8hT6d2ASxYg0qXrlIYnZRpneZu\n" +
          "j793rW1mgox3R0+6juNuOWA5mU9RzvikMtsMg8Dzj3yHXXJIG86gbeK9105de+UjpVT4siZnZ+kQ\n" +
          "dAIHcHUGXSRR95gzUUM9TChg1iBjp7tRzdKi4B2hJfct4xfd9kgV8/wNuZmmxmUXsncnJmVcneNi\n" +
          "zFNIXSGSmrQjQEoletCKNB7K6NwicbbxsumB3JoXPgHUJUFNJ1DvxOSd8Lxf7h9Lwb82w+pLSdUS\n" +
          "jqfPS2ppB3LGJ74HYzD755A6nKVzIPYdilsuk9WArgmb+s/el3H95JaoXNWI0D6KFZ08hRkjiFse\n" +
          "KN9BRtm6lxH4nYhRw+SRQXcwsAVhNPU9SW7j5t1W8DbfM0a9iwM/iHuQbDMYZ300McUtcHxkVzRX\n" +
          "IY9uifEroN8aHH0+SAy4t4pjJCd3VbHhomJu/X4KbjsEP4xsEd0vWIPEgJBeVlb+D+2KnWTFPmQb\n" +
          "gDHLiNXXLJknD0RLMsv2S1zj5NR3zePkCsWugli8J0n0iS1RHmk6VuPzef1ejvTmN9nOtNM6Htcd\n" +
          "U+snIjjm6QWx7V/xrkJLmtEsAlYYIc1435Tl8fffd26nvn/TqJHKG+WN4kDOg5ZArdsHPCCjiSDl\n" +
          "EYmW5MQVMSHEi3WMa/kIm+imi/ElBCuHNDg97BDI/DU3HxAWEuLFnAcHYERwGULtrEs1TnsfZcbn\n" +
          "Ob8UQ61w7WDQ0XzXAQcj12VaFbby+rh7X31OlT9Gfpuq9xavEj4kgO0rynYFZA2H2XApchTEySJE\n" +
          "chbiGddeu6kDlz99irs4f5y55g7YEoLPisRtEw1LcYuYETE7ixtbnBZ3VaKXZCX8Pqddv2aJJmXO\n" +
          "JslN733EcV373TJjR3bQcM4TndlmMGLiRMZocYs586AFCtP7Jsz4UBlPQubueNmHhFyY5GY+quVj\n" +
          "aLjhzXoSSUZeGIMXxeSm3PbC166kBbhtguFW1+o2VunaK9NlkGgoCunaWiRLVsMW2DDNlgBbiG15\n" +
          "GLX8nOzEdt1P0O1PrkSl1RTVfpaifbp4ILMGmRxXwf38jPS2+LpeDK7JCkRDlbBgUox500m76b2P\n" +
          "ObCRg4TRiv2gdYJsdyx7Qjzw0XMEc6DFDRcjzthxVdzGG2b4XVPW2Y/ezbt+Dsevnyge+bUklb9O\n" +
          "DMwVAhxtwOEEQycErx/TENFQ5a97T27gxvfustFdlah67cgW0m1reWZZn9B21TMkaMbHqOZClBqI\n" +
          "ogziMCuSZmYQN376xMJ7xAKFuSFstckOnwikIC9Oyec+FmZXPWuDoowEJJQP7VVFPm8cGjTtbvuQ\n" +
          "u2jC6nJdsLItVe62Mli16xTfSM3zDhlxZFIeB+k7JppxRdh0KKIGJkpCbAxExOQGHGDQ8H67VT71\n" +
          "FjL1ED5OWO37TQ/Feot3XQQ6YwWi4CokN8zQafcsPpLBT649ED44VVkl3nueb7GcTNuEJix0k7ar\n" +
          "vk9VtxwcSu2cWDo4pcQVEM8HGC4G0FMSwoYPfYUQIlDCRoGnFTpF9uxeEAvvEXuv2NZyF5Fh+Iz4\n" +
          "5taJMMsnT8TpYOpEruR36fO/6x10U8r1fW9cY1XNo7ksD1aBe5CUQMMjQHhV4wkGgJZxi+cOlvTM\n" +
          "n1yJpuztpxCe60/cat7Me8eYC5uvHScbrEeRlLTSeSPmkBZg3KuYKFPf+LiDnvSbI275ELEPKSDP\n" +
          "QOIqrCvQMBUAMz7FhtgShXFGkcmBrUyOaWnJvoQSQTm+hRv5PIerxtyibDsrHVYi9rPjlBwYdMVO\n" +
          "uBDT5Kb3biNTPz9eN4JhLanqHtihYrl/HXERFmzlXzuOJTlJPIWR50DsMWWxsv08I8m+j5XbnqaP\n" +
          "EB4ER0yhxr1jTIWdAKhYM2sQef0Y3LztpSCDnHTtpu7Y1Dc+8trdIGKCW87uOIFtNTCIaYZgFUlK\n" +
          "iJgZl5XLsYkitDW1z+3OVYVrEJ2mg/R0jjmVhQU3arZEseF+fxH1LJ9YA1Lbh5TLbViD3uc23Nr6\n" +
          "3CDjvysqwzslKMiormOAgwvDU8oTKTnDBbESImKyjJYP6CJ0CzarTyaf4tDeI2WW8XK+BvByUaiI\n" +
          "C7AaHObV6Cda/f/tfQl3GkmydUTWxg4CJIRAi92e3qa7Z+ad8/3/H/B9783rmfF0t6fbEgIJCS3s\n" +
          "1J75nciqggKDLNuStZh7DpaFWIoiozIy8t4b59S6xhUKuJgERbDZ+iieEi9JwT4Uq77z235/i6XJ\n" +
          "YA+JikRJ04WN877wuAITE8ByhbAMFSzqqMgYXCLCUIhg7++hZqIIftjdjUwhZQHCpfTAEbK7G6UJ\n" +
          "3EddVn2iZGmZzv+mk/mhKeBtnYOWPR9jv2DUAkTgxJNuSJyIqmkd/HxKNhXzEorkaLmwwI+4zXr8\n" +
          "Q3APgSSlEwqilL1omowsND1Qhg59f6DaXti+JeBG4rT0d1Na9c6Xd88fctmJxrC1twiYKBNPKrVJ\n" +
          "9iJySfALKfDIFiCpgqMypKodPmgQhRcDKZ0gU0jKNH2BzCLHIF9olgNEC0r4UWc+CJtS3bVZxqrH\n" +
          "rLo//gEWH4ux0jeCInxA2xWUZ1PBUegaEL+O2A1klm/pCjjhRux8hSyWJX5sinbjeP10iLAzn2Aq\n" +
          "7dggUbzkxiUFkBN0VQwaLnuRBglm5cjF2+fAsvdctjZiU+kEXdTpAojSHs2g7w6INCB7xVKzA4WB\n" +
          "9tAzkURIrSCJuSclykjEGqSrWVD6toQGbnhVmzbFhXneFKy4kN1VMWLVbBX/26K9Dkiyj7S4tTxg\n" +
          "nAt0iaalBmukjAZWPom0I36jT/SnBMPiWLnj8SoFBkTaAkRi7HOFFhLU5pL6WFmg2qSKpdSOhy0u\n" +
          "4w2zP0pHFouCZUFxw8OX4p2ZKPzupHMIhrIXUvoKqWimZC+hgVsw0M4bsmNI4iHXRBKhdzR3fTEh\n" +
          "ZeVWBtVvtxg5qJJJRmJkUvkbVXMoWEgc1OVspCxZHy3ipr8tHsTHYi64wl+YmBUeKOy5SApP5C/7\n" +
          "4HHFt0EVpqLAJKsqk3xC2JUU8jCI3GUVuk85vCj1/9TlxzLwgLXvuhyGtBlby6PCfaJxCuZ4Qppf\n" +
          "mj5wdyQ4SC4HJqjOEhcwzX3AZTP7TbjNiXnfY0Ts5MSvNOqUO5MAH/LdIXjeuSy4TpIqmKUEjHOB\n" +
          "Uf6Dr4mmTanCbgxkPE5tH6U9scdB7TtgDG0RNVw2pBeaQLb0araIuxw1q14ruj+yiYkW0POs4mAz\n" +
          "zwPqVkcsdypvk5GgnUugyRCssQtkmO+NHACi6Nuhcb4nAj2CiA00MXvV6SHcdIsf6qqP8TEgnQt1\n" +
          "qrP9wPKbuilSw3lyBgjZ/JQKUVpE/gbEeo9EjWwmYvrQI/rAx4uF2ypMzy8uBrOUTpBrkOnIjVZu\n" +
          "MPTSGtq6gnZ3AulHkc5FoPaIQekXgRarVII3qeztg06tWyxbRBZOwcpo2t1NBLc4Xwo+csSsGmm3\n" +
          "um9R4RnfaERFNlwmCydfgM7AT8iOfCBbt1xbYtQ1wexaAoJAQjlA6QITyRPifk7vxOl7cB/pHA+n\n" +
          "ztAlh6MIZlOF0VoBfU2VjAfJcaB0duLKjVhaI7GgQdeiYmfh6BYD4L03seQx+G4QxX/nsftgSRCB\n" +
          "CDwIw+/O8UHojMx40CST3PPhAwdRfJxFLVwU2SNWcs/knZwW54DU3lKjFvIjG1Xuh017lSjHjsmB\n" +
          "pzPBO283/8bvC5ab8u1V9y27I75P4ge9dHwueU0kmyfBmz1whNWzYNy3YDKwwKOZyPKDwSli8hw2\n" +
          "97I4Z5N9m9nonUP8RITpXNi6BaiFhu96gUUvGclnDOBJHaW4z+LAJy4I2wcM+ewYJORxe4CFtW18\n" +
          "oE+DIBYoHJcEzQcEEV+4D5a4Y+BUEaYQhZoL5Dr18mU4NjmMLkaQfPCZKBrzDOeY7TTAhGQSK6Co\n" +
          "DKncSK3/5Y1mJV/ytFCdGyGLHbA/9oDuBNFoj6WdIUeLfiqy5Qn6pi8c0wPb4TjhQQ8x2tiT6ZCA\n" +
          "iAg65a8FLqvhT4bvUtRuut01eEyESemn5cqfZPJEHepkOZ9sxRQVqfhA3g2+ZDyQvg8lKUAS8eRZ\n" +
          "CqzJwgV99OILPxdvq+6/6ebHbstezw89q+KBGymKXNQk44sqqhpSwjAYWI+gsLACpG+f5HTs1nKQ\n" +
          "QA6GZbHEcCKSps11akx1PZKdJ4hjp80UsbFZ6a429CKsWvQu2+xdfN8owIkD6MtNyNTEERudHrcs\n" +
          "jiPbxwkAHyZUxdJ16ncJXU+A6fIZ0ZGH6yJxk1rjASFifX6p2qoxGCQ0gK0c8TnRobS1nMJxM4fj\n" +
          "8ysxPBuIzcsJFnsuFLgQaRCQDvr+iiXnMnbHsnP/qXjnNReOgcfuB9A9QMMTIuELJH7ngzIW3gdX\n" +
          "Axhv6Hil5FAzt8AYWZBwXSTGhc5BaJcjSa9J0wcLuyEFZ2RVeWtZMOHCl3HTYxcfc+N9Yj6FgPBs\n" +
          "G1IZqzk2prkFRVuImqZwp5Bk1mZW+DxNzmdylpGuO/GmDO89rkeCIPAFHXvfUMGtF9ApJJi9l4dR\n" +
          "cwMHRx1x/cclrxz3YPNsLMo9BzYmnigAxxwAJENKaHw9ufzzLzvn7+AWJ2zZa2JsbGD4BxUmiga9\n" +
          "fA4GmzkYb+Ukc+NRBxHB1RHGBQOu6nnUJ9uY8H1meBwSY1cYY5erI1Mu+FRgxI0Mm4m9z+v7cyL+\n" +
          "/iwcHihnJGo6nPFs2ByOwO31hd3NCTebEjyXQpc2YVM6DBI6OJoyH0iPMY6itJxAG8uky6G0Lo0w\n" +
          "zCaAF5PobWeZuZURw2IGrnNZPC92RflkKMrXE9gYOqLoeJDnQqTIFzPsRhEOZXz/p1+1d/dRiNVC\n" +
          "BfjCBQ6u/P8kpYvBdh7O98vQqOThHJ5AEFGGatKaoJwm0z1GG+Sa5Qm9ZzF9aAsqOCiWJVRwICn1\n" +
          "6NIGZVEZG/7/NrPMp2DZFW0xiGRDaHnmFfBFCjiIkSXEeRd8xRAeKsJPGsIpptAjvYGhQl8J5OVP\n" +
          "BgLCIAqM7IhkOyKDy1wCiDc4TBpwtZHGXL0kchcjkb82ITe0Rc52IUsOUFS8nAsinAXRslP87i+f\n" +
          "HEQQBhA503HhgRAecbapWyKMt7LYqxWgs5nBJxFEEPlbJ1VglQxS0U4fOky/MsEY2EJ1Pa5cclBt\n" +
          "2Y1YpgKz7te3xW0e+ilfilgIZgwl1BAQVakSdzkEz1K4QwtwopaU0govpsggUhYSunRVf0yt/m+L\n" +
          "oIu5EJ4Pps7AzRloGgr0Skk09ooiMbAhMaSbJRLUhYLs1Gh/UIjQ9RunPbglkBZNs2XvPZ0OESTj\n" +
          "XEYRl2pXn4pdwkuoYG+kkGbU0UYSR/BEggikPwPAJK1BV82i9rKE2rXJ9JEjJEfL9Xz9oic9GsgP\n" +
          "zph6IEQbsSsvX58Ri+8breEUVLkFqaEjNkY9cFXGeSEJ3kYKiegoyHkmp5HhCQx1Bah/7KNHPLWj\n" +
          "ICIfQtq2IFNEMpIvJHBcTFBnRWmiSPtHysgWiumAYruC1KXUKjIeQA8RRNIwkaYi2pKgeYishxMK\n" +
          "+FkDvI0kejk9YHE/lSCCUDoxMhTAag7x+21QPcE02nyd2EKj1M70AhaXVFYqoapSWTDNmFVZHhZK\n" +
          "TLCmSkVoRjhCXPUBjs44J+86VUGeoSufwbyNhGziS1c+V27APvwnuBV4mNrxsM7CcJppS3aDppHX\n" +
          "G7jUQNpUAWwXwAmbcsVXRBhePGSGF26Qzp2Ddyp6n3bcQRAFqyNiLNFnkI2UFYCMDpBLAPmwSzyl\n" +
          "ICKQe7/IG8heboAmkGkTG9SeJbSeJdSWz5k/kZt5WXDDCk98NroPAtmqL+t97xP9XQlL31wYdAEw\n" +
          "LQHtK+HbDFwFmZ/XwdlMId9IIKY0OaAGGOxkPAksbtstO11RaVxyh/js//FThTx22sSS11r2wp+A\n" +
          "KQEiDKDoeHhsuyF6z6cWRHTYpHEfllKo+Yy8vVG9sphOfXSoB82l4KptAdlYpaWeRVlRZHgMwFjF\n" +
          "LrjIGsKRZpDlIXDXYOCXk+BU0ujmEox0V5QOUf+nsRJ0rnkSmBZKo2CBWXJAWvmJS21cBLVyAdsV\n" +
          "QXVvcSbC2Ve4NIjueJjN0rkwsMOZiCuBeQvNSGp4TE8tiCA8dxYD6BUSAAclhgNH2vlqyEF744N2\n" +
          "csVVz6FdcJECFZXpGgkeeek72B1PCFvkvRHwU4WLX6g/bFK4uip8hQlnN49+VpfPMh+7q+oyRIEU\n" +
          "VPmDAerHNpX92ObywwXRQjoXBpEIUwB5jLHZ8ikGEYSptqkAiFIK8Zsyk13KhStUz6aGy6hcDgTK\n" +
          "9RHZEysha1iZfTESN30Lty2Zrrr/ptda9hrSX0wE9HsfE8ChMBwLftjhXlJHmylyBnITqkIqYFQZ\n" +
          "XNMacZWh4BqfD08yiKTLuBDUaWKSUIFtZ1DjZaaatlAGplB7FmiO4Ko5ErJBFThgTF0aHssnFrE1\n" +
          "WnSjINelcT8jf2vfg3ynJzyFcZsx2f/IySUFNe3lxSR4etBQzHxkSeoXhycZRAKm0ykRVSmQrosp\n" +
          "hP0iw+5EqENH6AKY1gauX4yBDPOJ2GgE3QseMXUmHkh0pBakXAvEeVe4msqp9b+bTaGraei9LDK5\n" +
          "VtIC2qaznpEeDk81nZMI81Xf4zBiDPxCGvHFJqNSt845lY2FPvYEUYPIrZzSJEOyhKPE+iY2w21L\n" +
          "pp8akPFVN4Q1YC2cojyhgg1p2xKl8y7ArwnuGQl0UGXUtcahQsNWUh7Z8DH6fH8peLJBhGFp1PMF\n" +
          "0e8924ORykAtplHfLbHEwOLG1QgT52NBvUZlv1jZnU8Ji96PoQVIhEXGOa2iNYzo+ipwkZ5YwE+v\n" +
          "hKMZ3FQ1cFIqmhsJYeV0dDVGzjvvbwFy11hm3vMl4mnPRDCVlpOmhRxnRpoCF5kEsmIWlc0NNMpD\n" +
          "SDoOJCcjSNkcDe6iIZ+oRZ9+QVtwH3tJq7DqfaK9LW0qCDO4B9AbCZ91uE3M6A0dzXKKWBzMLqbA\n" +
          "yhloKzOVzGdB3HL7S8aTDqJFCEEdLmFATXuzSVC3C5Dom5hhHLIdIbLXY5GypX1TvOy9pFS3jKi6\n" +
          "bOa4+Q/LH7ISSzyr5foIohaJhu+IfLcPbkvh3m8G2BtJMTEUsF6WcKIwtHJBdzd71TvcNVZ82i8O\n" +
          "qniyp0JMK8NR5wJJCRFkOC7IYfS8voEZEFjShChxVxTHrsjbE0xIvawfqijxEX7+aLt8Kp0IP64F\n" +
          "hueIXG8A7vE5N/NJGBgaDjWF9TO6GKZVtJSgfQv/HOwmTwQFni89mFT+vgZajxBBviKm7T/IWC+o\n" +
          "E0jCIDAUtJcyyBt4UUxiWwexObb41sVElAcOZqRjkE+BFOnSw3OwqIp9KCxuxKrTtE5a3E4sUTjv\n" +
          "Cks3YKipMMwloFtOQjdnsFFCRSowOB4n6uQ9HX+Y8vphIEWbjviIC5/3CZU/0cooBYwSEhOj5mzS\n" +
          "pVILCIMg0HI59ney2EEOZxcjXj0e+JVLCwqeKRLURFEmPxERlC2QtRZVqStTu2WyWJjXka3CTYN8\n" +
          "UV4elb5B6L4nMv0xFMUlH+saDLeyeL2TwetcQpAAziQhme0JqrncKabFzPDYGJ37kESLc8avXxbU\n" +
          "+7tc3S+iVE5q3CiLU2b+A2TiEfyKppXG7tCCi8OSuNy68rvnI745cEWWe8wQ5LkaCmLnSk0PfU6W\n" +
          "Cfqm6yP5G0lAMt2h2GgbfKt5iZVGAc8zSbwqpqEvBJiWKzzvHq6PEflS8sd0gEwCIKUHLWLUsCnY\n" +
          "lwYVnwqLcQFzqcPCFTD4HmVu5hgK629l8LqaF1fVvN9v9/yxbwpn4iP3yAZJVYMIxDCtE4tT0AMj\n" +
          "zmqIykAU/K5sgZ/rj6F03hebza4op5Jio2eLKyquWA5Ydx1EcpM7JIfqKsBGGqBKDa902Y5Snj43\n" +
          "NEMWn7PK+cBQ2RP9pBHF/t290bm8ywEQg6zOeptp7NVzYnCW8Sf2wHfcieAeOe9gZIQROZl/RrHO\n" +
          "+95ncSBOKymy6CA1SLYLhd4Yyic9saUavJ0zMUNj3HEEuQbd6SfhYZDQT9LSbLsIhoaBtkYN0rug\n" +
          "S+j9yeUeI1SGT3f+vfl7kn+VHT80xsYFg40qaRxX09y61n23h75vcl8LqnRhAAVNjB+XZmLRfSaS\n" +
          "vgezEnnvZUwHNi7HUFb6opyyRI6MPlxPNqq60w9Bs0skmEvqQVEhZQhI64EMVQkZzrCkZ/Vzhorv\n" +
          "GYrPAL7CmJXWFGsjoVgbBjhp1fVkNxDawZRlcXWmJ6eLCoYp3WNL7SJEk6Yil4Mpx4eNoQ2b2hjK\n" +
          "E1cUBEDC8xHvemkXMESCqlzCDYo7Os2KgsPYRsgZgdEkgdZG4gspMjyrzdZVoGZUusq8hMp8QwFf\n" +
          "R58z7ojAj5Mun+G6SHZ0Ids3Fvr38hVFhhUbrCvunh9JH6FjXlY7xumzDV9A1vVhw/bEBiBk5H2+\n" +
          "wDuvK4TaGimmEwDXYzLbD8R0fRNgJyddmYAUuCqpBsWXkdZ9EUFEXes4MMYFos8BOafE3g0uqVSd\n" +
          "42pwk0m9HpanMVbPfcDZaNkgFHOHRWGvULMpjaGuK5K+yjyaT+/hsAWbLdWoFf3lSEj7YM8LqqQU\n" +
          "QCkNpz55X8JG7JcQRKoApJ6i1CZeN12hWNJRxsfgskozkRYGUtDNd2bFE4mYF1sHPBDiS7XQPxq5\n" +
          "8FRAJ6GCldHRShqyM7lPrWpQR6WtAAAgAElEQVTus1JPr23LTnJEABYwdgBMF2fSbniEcvx7wnMP\n" +
          "Ivoak64vUmNHpHumn+xZ3KCesB41/uE8ID5zi1ZOkg00q5VrsRlpsWp3i1GybAaZe+4SrHqOiL2V\n" +
          "iDt7UM9XnBgq9HIGXhVTeJVKwoDW/64Hgt/DPlFUFaW3Jz8Exw/WQRkDwYg5tT7R7cePwnMPImKe\n" +
          "ZUYOL1yNvMLZwMtdDP3U0BS66yOb7Q1RamcBKEpYWIg8msLf5y7/KxgK9434BiyfHoqlKtDPGHhe\n" +
          "zuDJTgHb2STSPtHEIenvHQdRPMYlCymczKmIQGXuEq2H9KBKN3XLWXVheEZ4NkEUfWm0mJXjTTan\n" +
          "A93xee564m2c9d3iybWT7/S81Mgkl03GJNVHMrl5uEayg8BRopK3EQZRWHKKt6v7XIgPwqj1hyt/\n" +
          "UsussabjdS6NZ9t5PD0o4dlGCrvkl2i7IO6DsRA/3zy8ptAETmshqs5ljYB+JUJyanTanvPE9Kxm\n" +
          "olnTKUEW14rDId23/GKr524dX9nlkyt747LvZUyLG5yiQzrFh2xp6gjEndlaSM5KdAtp1HP7R7Hc\n" +
          "6jYVuVUj6MaqXbwqJ2b9c1xJRKVGwxM0oJfJYKdcwHa9iO2DIl6W0jikdkGWc/9BFF1TMOItqgCa\n" +
          "guF+kgiCKHbdWXUanjqe1UwEUQtEuhT7It2z/eJJz638fmFvH3WsrbMre6M/8tKeJ3RBBDudzYJI\n" +
          "PjmU48iULgyiaBMWcOrQ/lkrdlG8Rm2RXfk/CwzsFgvYqZbxtF5mp/UintUKeF1M4ph0iqY72/i8\n" +
          "Dyx++kiOAjDbkI06/a1noieCiBFjKNQ9AgzT5oWzgbv165lV/eXUrDY69tZ13807tk+uBAooLFgR\n" +
          "s2hjNTQXi3RtURCxKIiUhdL3PWJxFqNLOh2WI6grqsMUHG5k8fKrLWx/t6OcvKrgabWAF/kk9NI6\n" +
          "WDRv0Ue7axb3MkQxHhUUeBg4X5J0/FkFEQRDPQEAhaHpbx9fOfXXJ+buv1tm9eTC3hxP/Bz4wgAF\n" +
          "WejTHYiSImc+Edj/BxW7MJD8aI2EM0YDTQYC7ydHWRx50uFwmsY5gDDMJOFyv4Ttn2qs+bc6a36z\n" +
          "xU62MnBhqNJiWDr/TK8P94mYEhdj22qRTcSXgudWnUtwgPzQ8qtnPWfv97Z18FvT3H3btrZ7PXfD\n" +
          "dXkKFNRAYzOj+6gShyLWJJe4LbH1EUY3bbZQ+ViO3crBtUTPFKne5E1K8kZaAi63i3j6zTY2/lJj\n" +
          "Rz9sY3OvgJ2sAT3q+Wr5gouYZOFeEQsihrPSd3y99CXguQSRFAr4AjJd0y83rp36b21r/03L3D9u\n" +
          "m7WrrrvpWX42DKCgEdg7/YuihVEk1Yytj6QBsxKTmWLsdoejJU7vEWJ6COABaSfNdAL7pQ3ovKiw\n" +
          "5tfbrPGyhI1qFk9zOnSpqYLnz5ZBn3sQR4K8aAvrS5KMP5cgIrlaZmD75beXdu1/jyf7fz8av/it\n" +
          "Ze53Lp2qN/GKwCEJGqpyFtJCaewUoUFDtKkq0zQ/rIgx2aQcmBb8jAoNGJ+R4pW6JXyXVbPPIkN7\n" +
          "en9YjXMlSU0GkK5Dv5LHzqsqa/1QZ0evKuxwK4fHSRXOEGEoBDgcYmyBzzyKI7LplzQDRXgOQUQh\n" +
          "kXYFlE567s6/Ts39/3c43v9HY7x7fG5VxxRA1Jk6SuNUDBq+Q2xNI2CmcYaQfCrCmrII10c8HkTq\n" +
          "LIjuejbi8Vo9Cb3BBhUHhTRcHGyyk59qyvGfd9jxfhGbGQM7AqDn+uApkSpqVcDeM6arRnz3mvDc\n" +
          "8dSDiPkAxtjhucuJX/mtY+/+43iy/7ox3jtqW9XuwCuBLzKgMT2WxomlHgoScW1sWGaiQgNGG7ER\n" +
          "SZXF3PHf6SD2afBDU+DAitFTFJgkU3hdLeMZzUIUQFRIKKexYyiijzQDiUCnp7DZgv5zTwjTdA5n\n" +
          "sv11de7xg0avMXZF9njgbf5xYdf/fjw5+Nfx5KDRturdnlsBhxdAYwnQGJN7QvF10HQGiuVU03QM\n" +
          "Z3wVmpF8NxDJYtjsCNXZvhFA7LHxS7C4XWqH8wt0OQMF6yBK5ibZFHYrm+zs1Q42v6mxo68rrHmw\n" +
          "ge2kBl0UaAYNhgOPg2ggPwSiUyf5vL4g34FwVgx7/TxjvfhTDiJdAGQvxl75Pxf2zt8bk72fG5O9\n" +
          "w7ZV6/XdLeHwHCAmQA8DSA0vj8HO35JvU8RGYDjDRA1qJC3ICdZHcjZSwwDCmBo2epkPmAPiwQNz\n" +
          "jAQfBE7SCehViuz86x128t0eO361zZo7eWwXE9hVGEzkRMlnS7SHLitHSnsv8gFccg15jnh0QSSm\n" +
          "JVIB0UI56PsppmXbcE/CsD2eb3Wdypu2Wf9HY7L7pmXWLq6cLYdmIIbJYAZSQK6F2KoUbhVCFyAR\n" +
          "S+soz6JZiOsAyrRz8YJk4pZvsMjm9KcpHH1wR9dgVMyxy4MKa/+wy5o/7LDWfhHbxRRcGQqM5aMR\n" +
          "HqUOe53OPTDk9ggX4fZIUHKipN/1RMDHCspPms9FZmj5W7+fWfX/tMy9P5qT3fa5VR2O/TIIoHWQ\n" +
          "NjcDfYj/DMbWRtFMJMINVio0CCcU8cVY3wHrdeF1wp+r4mqO0hPSejg4hgbDjRxe7m/i6bc1dvzT\n" +
          "Djv+bgtb1Sx20hr2HntPonVh4QERNZqlQJH8N9o99IObJXt6+jKQXI9nxw7fvOq7tV+a5t7hibl3\n" +
          "3rF3xiOvLAsJBtMgoWAshQsGnFg20ldsr0eBEd+Kl7OSFzC+qdgw9WZQFlK7hfG95OWniGg9ATPb\n" +
          "1jUcFTNwuV9hp9/W2fEPO+zo201s7ufYWVKDnvJE20w+ZzzKdI6HTGwnFkQ2F2BxUMYOT/QnXvG8\n" +
          "71abHbv+tjXZbXfsndHIK3EKIJXpoLOQXIqzqz28O7Zvhyi5jzh2/iyIiMEgWQwf0KclPjuJcAZy\n" +
          "wnUQgplKQq9aZuff1tjJj3XW/HqLtWo5PMvr0KVCw1MIoAcW1H92PMrCwlS8yYNZSWZwTBqbpj0u\n" +
          "itcjr/723Dp40zQPWqfm7kXX2bZcvhGsg0jiEKZxAZfnPTyUmwZ/NLvElK0RSZW5YTBpM9b3solu\n" +
          "cUM1Xl4PSKWUxvkgYKInsFsuyFJ286977OivdXZ0UMTWRhI7ANAP+QurPsgaD4RHW50LSIxBmZQF\n" +
          "NLc0F7Bp2rx+2fe+Oj6zv3rbtvYvL+2qafKiQEiBHlsHAcwcTcX0JW+B+KiH2MhnK1I6b8bwnpbI\n" +
          "xc2X46iUHayDfNnEOYHd0ga2X2yz4z/X2eFfasrRN5vYyiXwXGUygKxw9bTGI8OjDSLa9zAYdYgE\n" +
          "JnxZiSsMLX/7vO8enF7aL9sX9kHn2tkZTXxiJKTkOsgIDaHnNijeeemPwOLs4gfBI4sM7ozJMC2V\n" +
          "LZQCF6UNUZdVJ2AkMCokZPHyYIvJQsJ3VcmLa1UycgYarAPocePRBhFjSEGEnImkxXlhYPHq0aW9\n" +
          "//rEfPmmZb44u7B3R2OvAj4UQMVEwEiYroM+3ftz7vnRbBTfNyJTqvhtmd5IzE9oIlbKduQs5ICC\n" +
          "w3QaL/a28OTHXdb46y47/GYLG1sZPAGAK4CwnL3Go8WjDKKpHgUh6Qsojiy/2rpyXvy7Zb76uTF5\n" +
          "cXJq7fUGbgV8QQGUlBuqaiyAZqN4RjNdrMDF/RKWBlycnxrtGkapWlhgiGYiou9RpW4aSLFPEu95\n" +
          "5MfSOOLEMewrKexsl1jrux08/Osue/vnbXZUz+FJQoHLMIA+ax/WNT4cjyqIpH6UCmsI6ArQJ77I\n" +
          "9ifeVqvr7P3nzHzxa9N88fuJudu/diqCNlQpgAxFkZw4FWch8znKQ9NA8oIb8oX11MIBRJU4OzAZ\n" +
          "QYRxMonXpRJrv6qyxnc77PDrLdao5fE0a+DVOoCeDh7XTBSuzVVEw6MAMv3Nw0un9rpl7r8+Nl8c\n" +
          "t829XtfZAcsvAYMUaEydVuLet7H5qQf2DheOh0UGPySp+iGdAmIM7xA85pHgCOJmT5JJ1q0V8fyr\n" +
          "Gjv+sc6O/lRhh5UsHqd16ChBS/11AD0RPMZ0zgCA/MjyN5tXzt4/jycv/vvt+OUvx+P9iysZQGVg\n" +
          "ISMhCiAlZCREm6l3EUirtEHxPafpbOSH0gk+/1wRU6l5MpWjABqDhlelPJ6+2mZHlMJ9v8Pe7haw\n" +
          "kdLhzBcwcAFs9cN2n9Z4QDy2IFI5QNp0ebE98HbenFn7/2xMXvy7MdlrndtVa+wVASE9pfTo047H\n" +
          "4kNoa3cGId4NJJnWsflCQkAqpWO0NQ0GyQyeV0vYfFlhh3/aYm/reWxmDexwIQamK2QApRR8MG3Q\n" +
          "XSDaNKcbW7XsfCZ4TEFEW/+pkcM3Tgfu9q/n1t7r1uTgPy1z//Tc2rEG7iZ4IgsGMwJSKc5K2feO\n" +
          "FVqGSLw3DSI/rMjFiglRJc4Hx1BxtJGGy3IZT15U2FG9xP4opfEopcMpQ+mRYJNXHGm8ufJZz/2d\n" +
          "IlqSztyOn/cW8WMJIqlOJTZCe+BVX7et/f9pTA5oHdQ6t+qjgVcBV+RBkaVsmFsHBby2YGTftC5a\n" +
          "xVhYVbUTMF8oWPV8EVsbgR+TT4Qt/j0S2Ahy6Rnk03i5v4WnL3aUxjc77O3OBh6mDGgBQJfogcoz\n" +
          "6kQSqVwZzmfGzxGPIYgoATJcLvLXY2/r7aVd//lYaoP2356apA3aFB7PgYJGwIlTwg3VUC+xYmzf\n" +
          "LVbMRBIias8wu9Hl18cZJ06gaRjQ2yzg+csqa/24y44PyqxZzmA7qUIXiRMnhKSxxo2InipkM2o2\n" +
          "sxOmyv87vjDPCA8dRHRqqZSdvpz4pcaVU319au69Pp7s/3ESaINMy4+0QUrASMDZiju+yP/sX1LE\n" +
          "RgibgUW+3iIm8baBUxqnazgs5OCytsVO/1RlzT9XWWunIFnZXQYwIcW5pgY2vEZM/vRUQQGToG41\n" +
          "IrjmcRlUYmpk8txErg8dRLoHkKEAenNp7/z7xNz7+Viug/baHas6GocmIzqqkGCzGSig9JDp8+yr\n" +
          "+NgZaTFNWyaLWHyTaZYXluhQoAyikO8aroMEeGBrKvSLOezsVeDk1Q42yOrqVRlPNzN4pSCMI5UG\n" +
          "Cz+evIWcwZuO5DFDZSgbIVPgUOsVl4upF0ywRhJzX91Tx70H0bQSDDDXdQqD3v+JgeMXTvvu1i9n\n" +
          "Vu3vx5O9X5tm/fTC2h6N/Q3BBZFKVUgoMJU2wJKB/yCIz0TRhw2dOrzAIwERRvkUXtfLePZtDVvf\n" +
          "VlnzRRlPt7N4UTDkXpA3tXmId0J/4qpQuiAYZOkMKEWVlhcIK9cz0UeAR3ozUqryQLFK8oZgLxI1\n" +
          "j4vM5dgrH17atd9a5t6vx5Pd5pm10x96JeGLbKgNgikjAT5MgX23WGSRxsjdELMcDSS5smtDOoHd\n" +
          "7SKefbvDmn/bxePvKxhogwzsMZSkUj59nWcEjE3olM7Rd+99DkfWB8K9BpEIA8jiQUvCQJVKU7mg\n" +
          "/f302OGl066z859Tc+/3prl7fGrtdHtu2XNFTpJK9SUuPctEO7jyl/mDue1BLwIXxH2I806NIsYv\n" +
          "8KW4bpJMwvXWBmmDkBgJjb/t4PGLIrZLSbhWEEZfCiPhS5CK3/tMJB2gfKlKlVO643G0PWr/yItn\n" +
          "A2/78Nysv2mZe60zq9btuZuOzXPAMAEGY1NpQyDRDtdBSyQ/DwkeHoXkWQsOKExDh95WAc+lT1wd\n" +
          "Gz9UWePrEp6UU3ClMhlAzpcirvPFZ/IFf0Dc70wUdQUJ10RMQYYMk7bHi+d9r/pb29z7tTXZ/71l\n" +
          "1i+unIpt8Q3acAWVKXMbqo9CbyzmN1IhcisNR4krBDCw0IBBMYsXX1XYyV9I2lCHo6/K2NxMw7mK\n" +
          "U3HdF6NOfe69ieBzVudIQa0ITAqA0sTmO+1r+4B0Qf8+nuydnVnVwdgrgYAsqKgTjTtmXBY3GVmO\n" +
          "uT/d8LjpwSz8/r6nBCvhebc6qt/KIKJGQCSuQwsUGGRT2NktYeuHGh79Vx2P/rwNx9UstFWU2qC1\n" +
          "ycgzxL0GEQs3D2ULQi4Sli/yI9uvkjq1cW6/fHtqHjTOrPqo75Y9Dllp96uH4jplzj5z/oUfJI0T\n" +
          "MDcl8iknjqpyDqo4SqTYZa3ETr/ZZkc/7LDD7yvY2M3DWUqD66diMrLGh+Neg0huuimIHgPDsUW+\n" +
          "N/ErR1fO7i+n5sv/nExenJxbe+RWCg7Pg0acuFgh4SYKz8MCp119HUnrcUFhk0xC6VZLSvv7HeX4\n" +
          "hxo7+tMmHm3n4CSjT8V13jOr7K4R4l6DCIM3MBChMLR5pXFl02bqy/89HL98e2LuX3WdKjictEFp\n" +
          "UJkqy9jq1KJKTHlxywIpvil6U6oXP5gPh5gnfolZAHlhA2LOxmCo15sFtf1dVW38bVd5+/0OHtYK\n" +
          "cEzSBgi0Qfann801Hivue02k+wKyI4dvtnvu7m9t68U/GuMXr5uT3asLe9uy/Q1QMAUaanJ3bmq2\n" +
          "eJcmI3eIiI0QtT0RzEZN7eey6nmtrDW/rqpHX1eUo90Ca2UMuOAcBpYLrhaZAa2noWeJ+wwi2Xir\n" +
          "b/PScc+t/dq29v9N8m6SNnTsHU6FBIA0GOGGqs4+o7ThAzAb+BjuHAe1eh8dQ2GjbFa9rJSNk72K\n" +
          "frRbUg83s6yRNqDDEAYuBwdCw3lVWadyzxX3FUQkbciYHi83e07tnyfm/t+PJi9/aU5etC/sOh97\n" +
          "W+CLPOhyHTQvrpMIm6feVEVblcKtSvPETby4Za81rcbh9LVkEEmjEQcZjvIZ5bK+pZ++qBuNr7a1\n" +
          "t1sF9TCp4wkC9ISQXbyXugqv8bxwH0FEXOYUF1A8H3nVNx177x8N2Tdor3lOftlTw3l9SllWY/va\n" +
          "4pHszM3Z/UYSb3kjQ4VJIqF0t4ra+aua0fpuVz9+saU1i2nWVhlc+xxsn4OQ2Sm7IXbXeBa46yCi\n" +
          "AEpOXJ7vmX7lj469+7plHvxybO43Tk3JSBCkTlXRkD5xBnuc66CZ4WmwF0TkL0rjyBDcB1vV2TCf\n" +
          "VS92tozTb2pG88ea3qpsKGeZBOsaDMyorzKRLRT2ZbUZ+RJxl0FEwy5B4rrOiMR1Tv3npnnw+njy\n" +
          "onFi7l1fO9vc5BuAspAwT+mZSRs+LohWqVMXEd2/+Pj4rIPySIKpEUNGQtTfxeO2orFhLqddVCuJ\n" +
          "k5e1ROObHaPxTUU7KaSUS1WBsZQVYTjBhiLcqIPdOpCeJ+4qiDB06cl1TX+zce3W/tky935ujPf+\n" +
          "ODHr112n4tq8QGaMci/IYDGPBDEzGVkx9j8bFkd50J4iCCKPJN44yqbVq50t4+xVLdl6tZNoHmxq\n" +
          "p7WccpnScRTakUxZzCzGXV0H0PPFXQWR6gAQqXSj1Xe335xbu/8kbdDxpN7u2JXx2CsAiMAnLi5t\n" +
          "iAfOgwVQTNYQR1SJs3loOi/MRFLtbZaM8z/Vkyc/7qea324bJzt5tZNPsD4LSKVrfIG4iyBSfYBU\n" +
          "3+GF0763/WvH3gvWQZP9xpm10+u7ZccnSg/qQfBAvJQ9kxLcN25M+YSYtqEAmFXhKICcoO2JklC6\n" +
          "Gxv6+cudRPOn/VTjv/ZSza/L2ulmSr1iMGVmr7EOog+GVKeOXJ4/G3iVXztWndK4X1smVeKq132v\n" +
          "5Lo8rMRNW+DH2AgzTsDD4R27Xwz0GzKN84GDxXTWK23o5wc7yeb3e+mjn+qpxrcV46SaUi4TKq4D\n" +
          "6AvHe4NIzFV5w4ZbEC2WUfW5SHelyYhdfd0066+PJ/VG29q57rtl1+VZYDQDBQbb77TAfwyY0npC\n" +
          "VrbkxImgEkddG1Q2LOS0qxfVRJtSuB92k8evNvXWdlbtpFC2PflitEFrLMetgoiHTYilxNsX4JO9\n" +
          "E5K8k6cnDi+1rp3qmxNz719H4/3fGpN658KujE1/AwDToKI6nYHi2qC7HHarqnHLIGKGcnEds8BZ\n" +
          "GufwoO0JwCCVUi73No3WT/vpo//zIn34406yUc9rp2lcd21YI8CtgijqCOLJhsSy8TBdtFOmK4qX\n" +
          "Q3f7t7a5++vxeP/343H95NzatkZ+IK4zWBBA8VJ2VET+3FgaaDHZN4/YCLQXJBxgOMCkclEp662v\n" +
          "68nGX/dShz/Vko0XJb2d09mVABjhWtrwxQNuuybi4RhEhqAIYC6CNrF5/mzobv3RsWv/apm7v5+Y\n" +
          "9bMLe3s88jbApwBS1ICRMF0HPRKFaojZxk2QxkWFBJe7ZDqfTindQtk4f1VPNr/fTR39adto1Ara\n" +
          "Sd5gVwrA2A0DSIWn7RG3xqfj9oUFxGj33bBdyA9Nf/vwQkobDn5ujA+Ozqx6b+htgSfyASMBQ3Fd\n" +
          "aOwxZ8v7AVjFhftwxPy6YD6AZsRSB7gYKQnlequkt1/tpRp/fZl6+109+bZW1BsZQ2lT2xMKt7U2\n" +
          "aI0ItwqiyFcZpd0vFCYO3z7ru/tv2taLfx5PDn47Meu9rrvpepJUSm6lbKpOXTTqwQWGwOdGvEEx\n" +
          "j7RBtOCTbe/GoLOrQl5r71YTRz/up97+sJd6u79pHGcSyjkXomdxdKOl3XO2xl3j9nhvECnBYEEP\n" +
          "QbUFZAa2Xzrpu7XfO/bBmxPz4LBt7Z5duxVh88Bw3lBYzHA+9Ed4ZNU4jHhxURGB++BzK6Gxfiqv\n" +
          "ntcqRvNFLXH4spp4Wy/qjXxK6SgM+w6xFgQHVUXZ0W+NNeAD0jny3kmPHF5udN3av06t/Z+bk4M3\n" +
          "bWu/c+XsCNMvASdmNgaNt2aUnofZSI0wS//E7DHhNBQZLdrcB4+bTIF+IatcbFeMk5f15NH+duKP\n" +
          "rYJ2mEqwE5Vhj1x6IjL3up69Rhy3CSLZ9mTMoXzac2uvT8yD/z6aUBq33+zYtYnJywAYMBIiSk/c\n" +
          "ZET+L2p9cpNAaAXuYh00l0KGcnMvqsRxG1D000m1s1nUmy93kocvdxJvt4v6UcJgJ5zDpeNxRwMm\n" +
          "mLLsM6zxpeN9QcR8AIMYCadjv/LLubX7j+Zk/1+Nyd7hmV3tDr0ScBEwEuIbqrjCpeehEC8kREZ4\n" +
          "QSHBY0KMNYNdZbPq6UZRPyoX9bfFrHqY0FnbF6JrOtzS5ZUEpdH8fHSucdsr2YNTJO8RNwWRbHsy\n" +
          "9ni2MfDKv3Ts2t+PZQPi/eO2Ve92nQoQM1tlCdCRvTMDLZ6tZRfwd9yB7xBi4X2i/SCfR5Qej3Fh\n" +
          "pnXWyxb0862ycVwq6n9k0sofmsaOAeHSFzD25GQVbDBPzefX+GCIWBQ9t1N4UxDRBTjbGQUB9H8b\n" +
          "k72/H433fz81d697boVTIYGkDaQN0mJ9g2al7Jg7wbIIukOsmvHi/ggi7HsYSBs4rYOSOuuV81pn\n" +
          "ZzvR3N5OHFVK+ttcSj1WGZyhEDYTIKiAIG+IU7ORtbThwxAnhjxHXZVq+WEBjSg9MW4c6YMcXxSa\n" +
          "Xbfy66lZ++fRePdNayIbbzmWnwfEIID0WCHhsUi7YUkpncelDdwFhBFReqqbxum3u6lWvZo4zmXU\n" +
          "05SBRCodZ1QGaRUhrTFIaQi6ijJjjbrYrTt73w7R9kjU1OM5qnzVgR1093DJdJ7saXypkdN8Dpmx\n" +
          "7W/+fmbVfm+a+0fNyW7n3K46I7L7FRnQQ5cedelZefcemJulbnrUp2ImXw2yy2Ad5PConE0BNNaS\n" +
          "SrdY0s8OakmSNhy/3E6cGjq7VBQYhqaTkNQUSFIQqQiGitKcVV0H0gcBI9ZXeKaUGA95Wdb/FKH2\n" +
          "nSCILIfD0PJh5JDLhkibDi93R/7Om6a51zwxySduRwaQzzPS5mpO2iBbn0EoqX5XI7Rqdlpx9918\n" +
          "e+G/USUuCiCAsZJUrstl42x3J9n8up48/r6WOPnTVuJCYUhGiz49idI3ChhVQXmdUKLgWad1HwQm\n" +
          "pfI4DZzpxj3OekSvGh5PBarphUEUrKKVnuVr3QnfuBi4lfa1U2u0zN2zjrVjjrwy+DwwnDdCkxFl\n" +
          "oW/PQ2J+NAe/RYwEOzQZ4cJSdNYvbeidg1ry5Nv9dPPbWrL1smyc7+W1/lQXtFiUeOfl17gtcGH2\n" +
          "ifCciguqP3N6U2md4/giez3yqocde++wbe63T636Zc+tWC6PGhDPKD0rN1TjKd47f5w9ZuUl6BZl\n" +
          "u7lqc5RwxyaHyOLKCQPIExao2M9ltYuD7cTJXw7Sjb/tp46/qSROtjLqBQZ2v+47b7/GGu+BGq0c\n" +
          "EEHnAHnHFdXu0D047dgvGm1r7+rK2TZNv8iRGhAzbd5wfk6hOj/iMf6fJZf2+8TUcF6mcBy4MEHF\n" +
          "QTKrdWqVROu73eTR3/ZSjR9rydZeXuukNTYI+wbx9YBZ40OhMkTJ5Pd8kRxbfulq6NU7187B+ZV9\n" +
          "cNF1d4YTrwxCkN2vJqUNcZ84WD1RfEbM1mB8rowdtOjjYAHiMJVRLmoV4+SberLxw27q6Ltq8ni/\n" +
          "oJ8VDNbHIID89ehZ42Og+kLIvaK+6aePr9zN386s3bdn1kHnytkbjb1tafcbmS1qsRb4i5uqNwbT\n" +
          "itlHrPoFl/73nReKi/umHeumAcTBFTZorJ/OKhf1rUTrz/vpo78dpN9+V0se7hS0VsZgl6HJyFqd\n" +
          "usZHQ3U9Qdw4uBx6uT/O7cprMhlpW3vdvlMVLpktQgoUVGIF/lnwiBUDH1bHxNwDVq6J4h7aKx6D\n" +
          "0ZFEDj3hDGSLoArnCRMYkDq1UynTXlDy8L8OUn/8tJs83C/prUyCdYSAoY/grEvVa3wKVMcTZLoI\n" +
          "10O3eHRu7b5pma+uz+wDmLhVQEzLKpyA2RoDpk6lC32DVg3DxX2kOP9jRYCsnonmwWMP8EXU6506\n" +
          "MYx0jQ2MlHJR2kycfLObavy4lzr8cy359qCktwpJRRYSbE/YNLNSsVG96X3WWOMGqK7DE/Tn0dgv\n" +
          "Xvfdveuu8wr6zj7Q/dP29yIo6kc6aBGTes8VEJbEyk1BdKuCQ5x2ENulm8rNp/f5wLkFDEfJpHK9\n" +
          "mVUvtzf10/2d1PG3u8mj72vJo/qG3somlAuVYV8IsEmLR5WVVaG8xhq3gep7XK6JhM9T6PMCclEU\n" +
          "AAkZMNHWPMbG/G3XQUCh9b4AAAH+SURBVDf97UOevKzaPReH5E4KJgUPaMoomWTX1bze+apinH1T\n" +
          "T5LJSPNg02huF7TTbIJ1uBBD1xc2k2ylVYG7xhq3hyp4kFMlFfRKacWsbWiDLhcGuJyhlDdM2xrM\n" +
          "Wi+KFYN8aRys0hCxhT8ti5aF+0XE4wkSTBTgEFGUegWhwgbJBPaKOe1qr2ycf1dLnv2wm2y/2k6c\n" +
          "lTLqua7CJeeib7nC8TgHXWNSobrq8NdY47ZQFUTZTzSfVi4PKsYfji9SvQ294Luc+QxBqAzFrFXi\n" +
          "u/4ct/FLWPo3sWCTg2Lub++8AT0CBWVfxK5mCJ4iwFFQ2CrDsaYpg2xK6W8WtOt62bh6WTGuXmwa\n" +
          "19t5rWuo2Pd8Ppz4FEDBa6s38dfXWOMDoCoKUmt42Miqra92kv+TTmudgelnbJerLonyAn9qumSL\n" +
          "YPkQ09TMTR4LkbJqYln2GISFYJmb6SJCKYWZYIhCESA0Bp4O4GoM7ISCZspg40JaHW/m1NFWXh+V\n" +
          "c+ool1Imuoqm54PtcnD9uLZ71TGtscYHQlUVNOkpubR6BhqzsjmtOXJEYuJy3eFC8QQwEVi9z4Jo\n" +
          "GT49iGYJ4NJ0UaZeQkGkjS2RYOgbCF6CgZtS0c4azCmlVXszo9r5tOroGroc0J+43LdcLoihHsxC\n" +
          "MwLpGmvcBda+g2us8SkAgP8PmBlkORwqvbkAAAAASUVORK5CYII=\" transform=\"matrix(1 0 0 1 46 17)\">\n" +
          "</image>\n" +
          "</svg>";
    }
    return img;
  }
