'use strict';

let reduxStore;

/*
 *	weird trick to retrieve redux store
 *	there should be a better way
 */
exports.middleware = store => next => action => {
	if (!reduxStore) {
		reduxStore = store;
	}
	next(action);
};

/*
 *	remove default title setting by set Terms onTitle prop to noop
 *	maybe it's better to implement a map state to event?
 */
exports.decorateTerms = (Terms, {React}) => {
	return class extends React.Component {
		render() {
			const props = Object.assign({}, this.props, {onTitle: () => {}});
			return React.createElement(Terms, props);
		}
	};
};

/*
 *	decorate Term component to extend hterm by handling onTerminal event
 *  extends hterm object to set `setWindowTitle` method and dispatch a redux action in it.
 */
exports.decorateTerm = (Term, {React}) => {
	const onTerminal = originalOnTerminal => term => {
		term.setWindowTitle = title => {
			if (reduxStore) {
				// temporary use active tab, there should be a way to
				// find the uid of this particular hterm instance...
				const uid = reduxStore.getState().sessions.activeUid;
				reduxStore.dispatch({
					type: 'SESSION_SET_XTERM_TITLE',
					uid,
					title
				});
			}
		};

		if (originalOnTerminal) {
			originalOnTerminal(term);
		}
	};

	return class extends React.Component {
		render() {
			const originalOnTerminal = this.props.onTerminal;
			const props = Object.assign({}, this.props, {onTerminal: onTerminal(originalOnTerminal)});
			return React.createElement(Term, props);
		}
	};
};
