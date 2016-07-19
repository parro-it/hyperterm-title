'use strict';

const mkOnTerminal = (originalOnTerminal, onTitle) => term => {
	term.setWindowTitle = title => {
		onTitle(title);
	};

	if (originalOnTerminal) {
		originalOnTerminal(term);
	}
};

/*
 *  extends hterm object to set `setWindowTitle` method and run onTitle event.
 */
exports.decorateTerm = (Term, {React}) => {
	return class extends React.Component {
		render() {
			const originalOnTerminal = this.props.onTerminal;
			const onTerminal = mkOnTerminal(originalOnTerminal, this.props.onTitle);
			const props = Object.assign({}, this.props, {onTerminal});

			/*
			 *	remove default title setting by set Term onTitle prop to noop
			 */
			props.onTitle = () => {};
			return React.createElement(Term, props);
		}
	};
};

/*
 *	remove process title setting by canceling action
 */
exports.middleware = () => next => action => {
	if (action.type !== 'SESSION_SET_PROCESS_TITLE') {
		next(action);
	}
};
