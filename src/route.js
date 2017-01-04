"use strict";

import React from 'react';
import Nav from './nav';
import Footer from './footer';
import AdminModal from './adminModal';

/**
 * Main react route component
 */
class AppRoute extends React.Component{

	render() {
		return (
			<div>
				<Nav />
				<div id="home">
					{this.props.children}
					<AdminModal />
				</div>
				<Footer />
			</div>
		)
	}
};

export default AppRoute;