
class PaymentProcessor {
  process(type: string, amount: number) {
    if (type === "credit") {
      console.log("Processing credit card:", amount);
    } else if (type === "upi") {
      console.log("Processing UPI:", amount);
    } else if (type === "paypal") {
      console.log("Processing PayPal:", amount);
    }
  }
}


class Payment {
    process(type: string, amount: number){
        console.log("Processing ",type,amount)
    }
}

interface paymentMethod {
    
}

class creditCardPayment  extends Payment{
    process(type: string, amount: number): void {
        console.log
    }
}