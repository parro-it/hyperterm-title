'use strict';

let reduxStore;

exports.middleware = store => next => action => {
	if (!reduxStore) {
		reduxStore = store;
	}
	next(action);
};

exports.decorateTerms = (Terms, {React}) => {
	return class extends React.Component {
		render() {
			const props = Object.assign({}, this.props, {onTitle: () => {}});
			return React.createElement(Terms, props);
		}
	};
};

exports.decorateTerm = (Term, {React}) => {
	const onTerminal = originalOnTerminal => term => {
		term.setWindowTitle = title => {
			if (reduxStore) {
				const uid = reduxStore.getState().sessions.activeUid;
				reduxStore.dispatch({
					type: 'SESSION_SET_XTERM_TITLE',
					uid,
					title,
					custom: true
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
