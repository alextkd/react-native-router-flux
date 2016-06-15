'use strict';

import React, {PropTypes} from 'react';

import {
    NavigationExperimental,
} from 'react-native';

const propTypes = {
    initialAction    : PropTypes.object,
    reducer          : PropTypes.func,
    renderNavigation : PropTypes.func
};

const { StateUtils: NavigationStateUtils } = NavigationExperimental;

class RootContainer extends React.Component {

    state = {};

    static defaultProps = {
        initialAction : {type : 'RootContainerInitialAction'}
    };

    static childContextTypes = {
        onNavigate : PropTypes.func
    };

    static getBackAction = {
        type : 'BackAction'
    };

    componentWillMount() {

        let navState   = NavigationStateUtils.getParent(
            this.props.reducer(null, this.props.initialAction)
        );
        this.setState({ navState });
        this.handleNavigation.bind(this);
    }

    getChildContext():Object {
        return {
            onNavigate : this.handleNavigation
        };
    }

    handleNavigation(action) {
        const navState = this.props.reducer(this.state.navState, action);
        if (navState === this.state.navState) {
            return false;
        }
        this.setState({
            navState
        });

        return true;
    }

    render() {
        const navigation = this.props.renderNavigation(
            this.state.navState,
            this.handleNavigation
        );
        return navigation;
    }
}

RootContainer.propTypes = propTypes;

export default RootContainer;
