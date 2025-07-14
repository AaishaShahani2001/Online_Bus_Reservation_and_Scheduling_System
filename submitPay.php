<?php
include_once 'config.php';
session_start();

// Get and sanitize payment fields
$Name    = mysqli_real_escape_string($conn, $_POST["field1"]);
$Number  = mysqli_real_escape_string($conn, $_POST["field2"]);
$ExpDate = mysqli_real_escape_string($conn, $_POST["field3"]);
$CVV     = mysqli_real_escape_string($conn, $_POST["field4"]);

// Get selected seats
$selectedSeats = isset($_POST['selectedSeats']) ? $_POST['selectedSeats'] : '';

// Optional: You can split the seats into an array for further processing
$seatsArray = explode(",", $selectedSeats);

// Insert payment details securely
$stmt = $conn->prepare("INSERT INTO payment (Name, Number, ExpDate, CVV) VALUES (?, ?, ?, ?)");
$stmt->bind_param("ssss", $Name, $Number, $ExpDate, $CVV);

if ($stmt->execute()) {
    // You could now insert booking details into another table
    // For example: bookings (user_id, seat_number, bus_id, etc.)

    echo "<script>
        alert('Payment Successful! Your booked seats: $selectedSeats');
        window.location.href = 'bookingSuccess.html'; // Redirect to success page
    </script>";
} else {
    echo "<script>
        alert('Error processing payment: " . $stmt->error . "');
        window.history.back();
    </script>";
}

$stmt->close();
$conn->close();
?>
