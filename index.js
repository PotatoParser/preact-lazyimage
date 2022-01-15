import { Component, createRef, h } from 'preact';

class LazyImg extends Component {
	state = { show: false, timer: null }
	ref = createRef();
	observer = new IntersectionObserver((entries, observer) => {
		entries.forEach(entry => {
			const { target } = entry;
			if (entry.isIntersecting) {
				if (!this.state.show) {
					if (this.props.delay) {
						clearTimeout(this.state.timer);
						const timer = setTimeout(() => {
							this.setState({ show: true });
							if (this.props.onLoad) this.props.onLoad(this.ref.current);
						}, this.props.delay);
						this.setState({ timer });
					}
					else {
						this.setState({ show: true });
						if (this.props.onLoad) this.props.onLoad(this.ref.current);
					}
				}
			} else {
				if (this.state.show) {
					clearTimeout(this.state.timer);
					this.setState({ show: false });
					if (this.props.onUnload) this.props.onUnload(this.ref.current);
				}
			}
		});
	});

	observe() {
		this.observer.observe(this.ref.current);
	}

	unobserve() {
		this.observer.unobserve(this.ref.current);
	}

	componentDidMount() {
		this.observe();
	}

	componentWillUnmount() {
		this.unobserve();
		clearTimeout(this.state.timer);
		this.setState({ show: false });
	}

	render({ src, delay, cache, placeholder, onLoad, onUnload, ...props }, { show }) {
		return (
			<img
				ref={this.ref}
				src={show ? (!cache ? `${src}?q=${performance.now()}` : src) : placeholder }
				{...props}
			></img>
		);
	};
}

LazyImg.defaultProps = {
	placeholder: '',
	cache: true,
	delay: 0,
	src: '',
	onLoad: false,
	onUnload: false
};

export default LazyImg;