import 'bootstrap/dist/css/bootstrap.min.css'
import './Page.css'
import { isMobile } from "react-device-detect"

import SearchFilter from './SearchFilter'
import WhenFinished from './WhenFinished'
import Result from './Result'
import { SlotData } from '../helpers/types'

export const Page = () => {
    const pageClass = !isMobile ? "page" : "page-mobile"
    const slotData: Array<SlotData> = []
    return (<div className={pageClass}>
        {!isMobile && <div className="row1">
            <SearchFilter />
        </div>}
        {!isMobile && <div className="row2">
            <WhenFinished />
            <Result {...slotData} />
        </div>}
        {isMobile && <div className="row1-mobile">
            <SearchFilter />
        </div>}
        {isMobile && <div className="row2-mobile">
            <Result {...slotData} />
            <WhenFinished />
        </div>}
    </div>)
}

