/*! TravelWheels payment (ES5) — payment.html */
(function (win, doc) {
  function $(s){return doc.querySelector(s);}

  function loadCheckout(){
    try { return JSON.parse(sessionStorage.getItem("tw_checkout") || "null"); } catch(e){ return null; }
  }

  function maskCard(num){
    num = String(num || "").replace(/\s+/g,'');
    if (num.length < 4) return '••••';
    return '•••• •••• •••• ' + num.substr(-4);
  }

  function renderSummary(c){
    var el = $("#summary");
    if (!el) return;
    if (!c) { el.innerHTML = '<p>No pending order.</p>'; return; }
    el.innerHTML =
      '<div class="pw-row"><span class="pw-k">Route</span><span class="pw-v">'+ c.from +' → '+ c.to +'</span></div>'+
      '<div class="pw-row"><span class="pw-k">Bus</span><span class="pw-v">'+ c.busId +'</span></div>'+
      '<div class="pw-row"><span class="pw-k">Date</span><span class="pw-v">'+ c.dateISO +'</span></div>'+
      '<div class="pw-row"><span class="pw-k">Seats</span><span class="pw-v">'+ (c.seats || []).join(", ") +'</span></div>'+
      '<div class="pw-row"><span class="pw-k">Total</span><span class="pw-v">LKR '+ c.total +'</span></div>';
  }

  function validateCard(form){
    var name = form.name.value.replace(/^\s+|\s+$/g,'');
    var number = form.number.value.replace(/\s+/g,'');
    var expiry = form.expiry.value.replace(/\s+/g,'');
    var cvv = form.cvv.value;

    if (!name) { alert("Enter cardholder name"); return false; }
    if (!/^\d{16}$/.test(number)) { alert("Enter a 16-digit card number"); return false; }
    if (!/^\d{2}\/\d{2}$/.test(expiry)) { alert("Expiry must be MM/YY"); return false; }
    if (!/^\d{3,4}$/.test(cvv)) { alert("Enter a valid CVV"); return false; }
    return true;
  }

  function wire(){
    var checkout = loadCheckout();
    renderSummary(checkout);

    var form = $("#card-form");
    if (!form) return;
    form.addEventListener("submit", function(e){
      e.preventDefault();
      if (!checkout) { alert("No pending order."); return false; }
      if (!validateCard(form)) return false;

      // Persist booking
      var user = null;
      try { user = JSON.parse(localStorage.getItem("tw_session") || "null"); } catch(e){}
      var payload = {
        busId: checkout.busId,
        dateISO: checkout.dateISO,
        from: checkout.from,
        to: checkout.to,
        seats: checkout.seats,
        username: user && user.username ? user.username : null,
        createdAt: (new Date()).toISOString(),
        payment: {
          method: "card",
          masked: maskCard(form.number.value),
          total: checkout.total
        }
      };
      if (win.TWData && TWData.saveBooking) TWData.saveBooking(payload);

      // Clear pending
      sessionStorage.removeItem("tw_checkout");
      sessionStorage.removeItem("tw_selected_trip");

      // Go to success
      win.location.href = "bookingSuccess.html";
      return false;
    });
  }

  if (doc.readyState === "loading") doc.addEventListener("DOMContentLoaded", wire); else wire();
})(window, document);
