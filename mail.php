<?php
header('Content-Type: text/html; charset=utf-8');
if($_SERVER['REQUEST_METHOD'] != 'POST')
{
	//This page should not be accessed directly. Need to submit the form.
	echo "Ошибка! Вы не можете получить доступ напрямую - воспользуйтесь формой";
  exit;
}
$name = $_POST['clientName'];
$phone = $_POST['clientPhone'];
$visitor_email = "alegorn.mail@gmail.com";
$message = "";

//Validate first
if(empty($name)||empty($phone))
{
    echo "Имя и телефон обязательны!";
    exit;
}


$email_from = 'hello@blanchard.ru';
$email_subject = "Обратный звонок на $phone, $name";
$email_body = "$name, заказал обратный звонок на номер $phone.\n".
                            // "Here is the message:\n $message".

$to = "alegorn.mail@gmail.com";
$headers = "From: $email_from \r\n";
$headers .= "Reply-To: $visitor_email \r\n";
//Send the email!
mail($to,$email_subject,$email_body,$headers);
//done. redirect to thank-you page.
header('Location: thankyou.html');


?>
