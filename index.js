import { Component, createRef, h } from 'preact';

function waitForEvent(target, event) {
	return new Promise(resolve => {
		target.addEventListener(event, resolve, {
			once: true
		});
	})
}

class LazyImg extends Component {
	static observer = new IntersectionObserver((entries, observer) => {
		entries.forEach(entry => {
			const { target } = entry;
			if (entry.isIntersecting) {
				if (target.src === '') target.dispatchEvent(new CustomEvent('startlazy'));
			} else {
				if (target.src !== '') target.dispatchEvent(new CustomEvent('stoplazy'))
			}
		});
	});

	ref = createRef();

	componentDidMount() {
		let { startLazyLoad, stopLazyLoad, noCache, src } = this.props;

		this.startLazyLoad = startLazyLoad;
		this.stopLazyLoad = stopLazyLoad;

		if (!(src instanceof Array)) src = [src];

		if (!this.startLazyLoad) this.startLazyLoad = e => {
			const { target } = e;
			if (src.length === 1) target.src = src + (noCache ? `?${performance.now()}` : '');
			else {
				(async () => {
					for (const image of src) {
						target.src = image + (noCache ? `?${performance.now()}` : '');
						await waitForEvent(target, 'load');
					};
				})();
			}
		}

		if (!this.stopLazyLoad) this.stopLazyLoad = e => {
			const { target } = e;
			target.removeAttribute('src');
		}
		
		this.ref.current.addEventListener('startlazy', this.startLazyLoad);
		this.ref.current.addEventListener('stoplazy', this.stopLazyLoad);
		LazyImg.observer.observe(this.ref.current);
	}

	componentWillUnmount() {
		this.ref.current.removeEventListener('startlazy', this.startLazyLoad);
		this.ref.current.removeEventListener('stoplazy', this.stopLazyLoad);
		LazyImg.observer.unobserve(this.ref.current);
	}

	componentDidUpdate(prevProps, prevState) {
		LazyImg.observer.unobserve(this.ref.current);
		if (this.props.startLazyLoad && prevProps.startLazyLoad && this.props.startLazyLoad !== prevProps.startLazyLoad) {
			this.ref.current.removeEventListener('startlazy', this.startLazyLoad);
			this.startLazyLoad = this.props.startLazyLoad;
			this.ref.current.addEventListener('startlazy', this.startLazyLoad);
		}
		if (this.props.stopLazyLoad && prevProps.stopLazyLoad && this.props.stopLazyLoad !== prevProps.stopLazyLoad) {
			this.ref.current.removeEventListener('stoplazy', this.stopLazyLoad);
			this.stopLazyLoad = this.props.stopLazyLoad;
			this.ref.current.addEventListener('stoplazy', this.stopLazyLoad);
		}
		LazyImg.observer.observe(this.ref.current);
	}

	render({ src, ...props }) {
		return (
			<img
				ref={this.ref}
				{...props}
			></img>
		);
	};
}

export default LazyImg;