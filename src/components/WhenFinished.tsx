import 'bootstrap/dist/css/bootstrap.min.css'
import './WhenFinished.css'
import { isMobile } from "react-device-detect"

const WhenFinished = () => {
    const className = !isMobile ? "when-finished" : "when-finished-mobile"
    return (<div className={className}>
        <p>Go to Cowin Website to book Slot</p>
        <p>Go to Aarogya Setu App</p>
        <p>Go to Umang App</p>
    </div>)
}

export default WhenFinished