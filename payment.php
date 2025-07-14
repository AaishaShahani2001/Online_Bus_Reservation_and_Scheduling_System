
<?php
// Start the session if needed (optional, for tracking user info)
session_start();

// Retrieve selected seats from viewSeats.html via POST
$selectedSeats = isset($_POST['selectedSeats']) ? $_POST['selectedSeats'] : '';
$selectedSeatsArray = array_filter(explode(',', $selectedSeats));
$seatCount = count($selectedSeatsArray);
$farePerSeat = 500;
$totalFare = $seatCount * $farePerSeat;
?>

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Payment Method - TravelWheels</title>
  <link rel="stylesheet" href="css/payment.css">
  
  <style>
    .payment-method {
      margin-top: 115px;
    }
    .seat-summary {
      margin: 10px 0 8px;
      font-size: 18px;
      font-weight: 500;
      color: #003366;
    }
    .fare-summary {
      font-size: 18px;
      margin-bottom: 25px;
      color: #009933;
    }
  </style>
</head>
<body>

<header class="header">
  <div class="logo">Bus</div>
  <nav class="navbar">
    <a href="homepage.html">Home</a>
    <a href="#">About Us</a>
    <a href="contactus.html">Contact Us</a>
    <a href="support.html">FAQs</a>
  
  </nav>
</header>

<main>
  <section class="payment-method">
    <h2>Select Payment Method</h2>

    <!-- Show selected seats and total fare -->
    <?php if (!empty($selectedSeats)) : ?>
      <p class="seat-summary">Selected Seat(s): <strong><?php echo htmlspecialchars($selectedSeats); ?></strong></p>
      <p class="fare-summary">Total Fare: Rs. <strong><?php echo number_format($totalFare); ?></strong></p>
    <?php else: ?>
      <p class="seat-summary" style="color: red;">No seats selected. <a href="viewSeats.php">Go back</a></p>
    <?php endif; ?>

    <form id="payment-form" action="submitPay.php" method="POST">
      <!-- Hidden fields to pass seat and fare data -->
      <input type="hidden" name="selectedSeats" value="<?php echo htmlspecialchars($selectedSeats); ?>">
      <input type="hidden" name="totalFare" value="<?php echo $totalFare; ?>">

      <div class="payment-options">
        <button type="button" id="visa-master" class="payment-btn">
          <img src="images/visa-mastercard.jpg" alt="Visa/Mastercard">
          Visa/Mastercard
        </button>
        <button type="button" id="amex" class="payment-btn">
          <img src="images/American.png" alt="American Express">
          American Express
        </button>
      </div>

      <div class="card-details">
        <label for="name-on-card">Name on Card:</label>
        <input type="text" id="name-on-card" name="field1" required>

        <label for="card-number">Card Number:</label>
        <input type="text" id="card-number" name="field2" required maxlength="16">

        <label for="expiry-date">Expiry Date (MM/YY):</label>
        <input type="date" id="expiry-date" name="field3" required>

        <label for="cvv">CVV:</label>
        <input type="text" id="cvv" name="field4" required maxlength="4">

        <button type="submit" class="pay-btn">Pay</button>
      </div>
    </form>
  </section>
</main>

<script>
document.getElementById('payment-form').addEventListener('submit', function (event) {
  let valid = true;
  const nameOnCard = document.getElementById('name-on-card').value;
  if (!nameOnCard) {
    alert('Name on card is required.');
    valid = false;
  }

  const cardNumber = document.getElementById('card-number').value;
  const cardPattern = /^[0-9]{16}$/;
  if (!cardPattern.test(cardNumber)) {
    alert('Invalid card number. Must be 16 digits.');
    valid = false;
  }

  const cvv = document.getElementById('cvv').value;
  if (!/^[0-9]{3,4}$/.test(cvv)) {
    alert('Invalid CVV. Must be 3 or 4 digits.');
    valid = false;
  }

  if (!valid) {
    event.preventDefault();
  }
});
</script>

</body>
</html>
