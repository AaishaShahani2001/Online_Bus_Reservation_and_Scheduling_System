/*! TravelWheels checkout (ES5) — submitPay.html */
(function (win, doc) {
  function $(s){return doc.querySelector(s);}

  function fmtSeats(arr){ return arr && arr.length ? arr.join(", ") : "-"; }

  function loadCheckout(){
    try { return JSON.parse(sessionStorage.getItem("tw_checkout") || "null"); } catch(e){ return null; }
  }

  function render() {
    var c = loadCheckout();
    var card = $("#order-card");
    if (!card) return;

    if (!c) {
      card.innerHTML = '<p>No pending order. <a href="OnlineBusSeatReservation.html">Search buses</a></p>';
      $("#proceed") && ($("#proceed").disabled = true);
      return;
    }
    var perSeat = c.seats && c.seats.length ? Math.round(c.total / c.seats.length) : 0;

    card.innerHTML =
      '<div class="pw-row"><span class="pw-k">Route</span><span class="pw-v">'+ (c.from||'') +' → '+ (c.to||'') +'</span></div>'+
      '<div class="pw-row"><span class="pw-k">Bus</span><span class="pw-v">'+ (c.busId||'') +'</span></div>'+
      '<div class="pw-row"><span class="pw-k">Date</span><span class="pw-v">'+ (c.dateISO||'') +'</span></div>'+
      '<div class="pw-row"><span class="pw-k">Seats</span><span class="pw-v">'+ fmtSeats(c.seats) +'</span></div>'+
      '<div class="pw-row"><span class="pw-k">Fare/Seat</span><span class="pw-v">LKR '+ perSeat +'</span></div>'+
      '<div class="pw-row"><span class="pw-k">Total</span><span class="pw-v">LKR '+ c.total +'</span></div>';
  }

  function wire(){
    render();
    var proceed = $("#proceed");
    if (proceed) proceed.onclick = function(){ win.location.href = "payment.html"; };
    var cancel = $("#cancel");
    if (cancel) cancel.onclick = function(){
      if (confirm("Cancel this order?")) { sessionStorage.removeItem("tw_checkout"); win.location.href = "homepage.html"; }
    };
  }

  if (doc.readyState === "loading") doc.addEventListener("DOMContentLoaded", wire); else wire();
})(window, document);
