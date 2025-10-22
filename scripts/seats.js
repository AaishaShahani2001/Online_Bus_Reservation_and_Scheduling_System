/*! TravelWheels seat page (ES5) — checkout handoff */
(function (win, doc) {
  function qs(sel, root) { return (root || doc).querySelector(sel); }
  function qsa(sel, root) { return (root || doc).querySelectorAll(sel); }

  function loadTrip() {
    try { return JSON.parse(sessionStorage.getItem("tw_selected_trip") || "null"); }
    catch (e) { return null; }
  }

  function disableBookedSeats(busId, dateISO) {
    if (!win.TWData || !TWData.findBookedSeats) return;
    var locked = TWData.findBookedSeats(busId, dateISO);
    var map = {}; var i;
    for (i=0;i<locked.length;i++) map[locked[i]] = true;
    var seats = qsa(".seat");
    for (i=0;i<seats.length;i++) {
      var el = seats[i];
      var code = el.getAttribute("data-seat");
      if (map[code]) { if (el.className.indexOf("booked") === -1) el.className += " booked"; el.setAttribute("title","Already booked"); }
    }
  }

  function computeFare(busId, seatCount) {
    var per = 500; // fallback
    if (win.TWData && TWData.getBusById) {
      var b = TWData.getBusById(busId);
      if (b && b.fare) per = b.fare;
    }
    return per * seatCount;
  }

  function onFormSubmit(e) {
    if (e && e.preventDefault) e.preventDefault();
    var trip = loadTrip();
    if (!trip) { alert("Trip not found. Please pick a bus again."); win.location.href = "OnlineBusSeatReservation.html"; return false; }

    var hidden = qs("#selected-seats"); 
    var seatsCSV = hidden ? String(hidden.value || "") : ""; 
    var seats = seatsCSV ? seatsCSV.split(",") : [];
    if (!seats.length) { alert("Select at least one seat."); return false; }

    var total = computeFare(trip.busId, seats.length);

    /* store pending checkout, do NOT save booking yet */
    try {
      sessionStorage.setItem("tw_checkout", JSON.stringify({
        busId: trip.busId, dateISO: trip.date, from: trip.from, to: trip.to,
        seats: seats, total: total, createdAt: (new Date()).toISOString()
      }));
    } catch (e1) {}

    win.location.href = "submitPay.html";
    return false;
  }

  function wire() {
    var trip = loadTrip(); if (trip) disableBookedSeats(trip.busId, trip.date);
    var form = qs('form[action="submitPay.html"]'); /* update your viewSeats form action to submitPay.html */
    if (form && !form.getAttribute("data-tw-seat")) { form.setAttribute("data-tw-seat","1"); form.addEventListener("submit", onFormSubmit); }
  }
  if (doc.readyState === "loading") doc.addEventListener("DOMContentLoaded", wire); else wire();
})(window, document);
