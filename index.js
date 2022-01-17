import { Component, createRef, h } from 'preact';

const GLOBAL_OBSERVER = new Map();

let LEGACY = false;

class LazyImg extends Component {
	state = { show: false, timer: null }
	ref = createRef();
	observer = new IntersectionObserver((entries, observer) => {
		entries.forEach(entry => {
			const { target } = entry;
			if (entry.isIntersecting) {
				this.show();
			} else {
				this.hide();
			}
		});
	});

	show() {
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
	}

	hide() {
		if (this.state.show) {
			clearTimeout(this.state.timer);
			this.setState({ show: false });
			if (this.props.onUnload) this.props.onUnload(this.ref.current);
		}
	}

	async lazyload() {
		const H = window.innerHeight;
		const W = window.innerWidth;
		const element = this.ref.current;
		const { top, right, width, height } = element.getBoundingClientRect();
		const { preloadWidth, preloadHeight } = this.props
		if (top + height + preloadHeight < 0 || right + width + preloadWidth < 0 || top > H + preloadHeight || right > W + preloadWidth) this.hide();
		else this.show();
	}

	observe() {
		if (!this.props.legacy) this.observer.observe(this.ref.current);
		else {
			if (!LEGACY) {
				LEGACY = true;
				const observer = async () => {
					for (const [component, _] of GLOBAL_OBSERVER) component.lazyload();
				};
				window.addEventListener('scroll', observer);
				window.addEventListener('resize', observer);
			}
			GLOBAL_OBSERVER.set(this, true);
			this.lazyload();
		}
	}

	unobserve() {
		if (!this.props.legacy) this.observer.unobserve(this.ref.current);
		else GLOBAL_OBSERVER.delete(this);
	}

	componentDidMount() {
		if (!this.props.legacy && (this.props.preloadWidth || this.props.preloadHeight)) throw new Error(`<legacy> property must be true to use preloading`);
		this.observe();
	}

	componentWillUnmount() {
		this.unobserve();
		clearTimeout(this.state.timer);
		this.setState({ show: false });
	}

	render({ src, delay, cache, placeholder, onLoad, onUnload, legacy, preloadWidth, preloadHeight, ...props }, { show }) {
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
	onUnload: false,
	legacy: false,
	preloadWidth: 0,
	preloadHeight: 0
};

export default LazyImg;