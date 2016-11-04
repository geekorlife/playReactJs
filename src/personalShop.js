import React from 'react';

class personalShop extends React.Component{
    render(){
        return (
            <div className="text-center" style={{marginTop:'110px'}}>
                <h3>Your personal Shop</h3>
                <p>It looks that you don't have a personal shop.</p>
                <p>
                A personal shop is a dedicate space where you will be able to manage all of your ads.<br/>
                When you have setup your personal shop, a link on each of your ads will give the possiblity to the other users to enter in your personal shop and take a look of all of your products.
                </p>
                <button>Create my personal personal Shop</button>
            </div>
        )
    }
}

export default personalShop;