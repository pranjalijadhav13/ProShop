const addDecimals = (num) => {
    return (Math.round(num*100)/100).toFixed(2);
}

export const updateCart = (state)=> {
    /*Let's start with the item's price.

    So we're just going to take our state and we're going to add on to that an item's price value.

    And we can get that by just taking all of the price values for each item in the cart and adding them

    together.

    So let's take the cart items.

    So state dot cart items and let's say dot reduce.

    So we're going to reduce and that takes in a function.

    And the what we're going to pass in here is the accumulator and then the item itself.

    And that accumulator, we're going to set that to to zero.

    And basically it'll start from there and then we can add the prices together.

    So let's take the accumulator, add on the item dot price, and then we also need to take into account

    the quantity, right?

    Because if you have two or more of an item, then you need to add that to the price.

    So we're going to say times item dot Qty.

    And then the next argument we pass in is the default for the accumulator, which is going to be zero.

    So this starts at zero.

    It'll loop through, it'll add the item price multiply by the quantity and we should end up with the

    total item price. */
        state.itemsPrice = addDecimals(state.cartItems.reduce((acc, item)=>acc + item.price*item.qty,0));

        //shipping price(if order is over 100$, then free shipping. else 10$ shipping fee)
        state.shippingPrice = addDecimals(state.itemsPrice > 100 ? 0 : 10);

        //tax price
        state.taxPrice = addDecimals(Number(0.15*state.itemsPrice).toFixed(2));

        //total price
        state.totalPrice = (
            Number(state.itemsPrice) +
            Number(state.taxPrice) +
            Number(state.shippingPrice)
        ).toFixed(2);

      localStorage.setItem('cart', JSON.stringify(state));

      return state;
}

