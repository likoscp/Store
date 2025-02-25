"use client";
import { useState, useEffect } from "react";
import { jwtDecode } from 'jwt-decode';

export default function CartPage() {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [orderId, setOrderId] = useState(null); 

    useEffect(() => {
        const fetchCart = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                alert('Please log in to add products to your cart');
                return;
            }

            const decodedToken = jwtDecode(token);
            console.log(decodedToken);
            const userId = decodedToken.id;

            if (!userId) {
                alert('User ID not found in token');
                return;
            }
            try {
                const response = await fetch(`https//store-gyhu.vercel.app/orders/userstatus/${userId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                
                const data = await response.json();

                if (data.length > 0) {
                   
                    setOrderId(data[0]._id);

                    const transformedItems = data[0].items.map(item => ({
                        id: item._id,
                        name: item.productId.name,
                        price: item.productId.price,
                        quantity: item.quantity
                    }));
                    setCartItems(transformedItems);
                } else {
                    setCartItems([]);
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchCart();
    }, []);

    const handleQuantityChange = (id, newQuantity) => {
        setCartItems((prevItems) =>
            prevItems.map((item) =>
                item.id === id ? { ...item, quantity: newQuantity } : item
            )
        );
    };

    const handleRemoveItem = (id) => {
        setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
    };

    const handleCheckout = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            alert('Please log in to proceed to checkout');
            return;
        }

        if (!orderId) {
            alert('Order ID not found');
            return;
        }

        try {
            const response = await fetch(`https//store-gyhu.vercel.app/orders/${orderId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ status: 'completed' }),
            });


            window.location.reload();
        } catch (err) {
            setError(err.message);
        }
    };

    const totalPrice = cartItems.reduce(
        (total, item) => total + item.price * item.quantity,
        0
    );

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className="mx-auto max-w-screen-xl px-4 2xl:px-0">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">
                Shopping Cart
            </h2>

            <div className="mt-6 sm:mt-8 md:gap-6 lg:flex lg:items-start xl:gap-8">
                <div className="mx-auto w-full flex-none lg:max-w-2xl xl:max-w-4xl">
                    {cartItems.length === 0 ? (
                        <p>Your cart is empty</p>
                    ) : (
                        <div className="space-y-6">
                            {cartItems.map((item) => (
                                <div
                                    key={`${item.id}-${item.name}`}
                                    className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800 md:p-6"
                                >
                                    <div className="space-y-4 md:flex md:items-center md:justify-between md:gap-6 md:space-y-0">
                                        <div className="text-end md:order-4 md:w-32">
                                            <p className="text-base font-bold text-gray-900 dark:text-white">
                                                ${(item.price * item.quantity).toFixed(2)}
                                            </p>
                                        </div>

                                        <div className="w-full min-w-0 flex-1 space-y-4 md:order-2 md:max-w-md">
                                            <p className="text-base font-medium text-gray-900 dark:text-white">
                                                {item.name}
                                            </p>
                                        </div>

                                        <div className="flex items-center justify-between md:order-3 md:justify-end">
                                            <div className="flex items-center">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleQuantityChange(
                                                            item.id,
                                                            Math.max(1, item.quantity - 1)
                                                        )
                                                    }
                                                    className="h-5 w-5 border rounded-md"
                                                >
                                                    -
                                                </button>
                                                <input
                                                    type="text"
                                                    value={item.quantity}
                                                    readOnly
                                                    className="w-10 text-center"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleQuantityChange(
                                                            item.id,
                                                            item.quantity + 1
                                                        )
                                                    }
                                                    className="h-5 w-5 border rounded-md"
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() => handleRemoveItem(item.id)}
                                            className="text-red-600"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="mx-auto mt-6 max-w-4xl flex-1 space-y-6 lg:mt-0 lg:w-full">
                    <div className="space-y-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800 sm:p-6">
                        <p className="text-xl font-semibold text-gray-900 dark:text-white">
                            Order summary
                        </p>

                        <dl className="flex items-center justify-between">
                            <dt className="text-base font-normal text-gray-500 dark:text-gray-400">
                                Total
                            </dt>
                            <dd className="text-base font-bold text-gray-900 dark:text-white">
                                ${totalPrice.toFixed(2)}
                            </dd>
                        </dl>

                        <button
                            className="w-full bg-primary-700 text-white px-5 py-2.5 rounded-lg"
                            onClick={handleCheckout}
                        >
                            Proceed to Checkout
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}