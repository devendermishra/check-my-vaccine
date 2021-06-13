import { _T } from '../helpers/multilang'
import { Dropdown } from 'react-bootstrap'
import { SettingsItem } from './Settings'
import { FavoriteItem } from './FavoriteDialog'
import { DisclaimerItem } from './DisclaimerModal'
import { InstructionsItem } from './Instructions'
import { TermsItem } from './TermsConditions'
import MenuIcon from '@material-ui/icons/Menu'

export default function PreferenceMenuDropDown() {
    return (
        <>
            <Dropdown>
                <Dropdown.Toggle variant="success" id="dropdown-basic">
                <MenuIcon color="error" /> {_T('PREFERENCES')}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                    <SettingsItem />
                    <FavoriteItem />
                    <Dropdown.Divider />
                    <InstructionsItem />
                    <Dropdown.Divider />
                    <DisclaimerItem />
                    <TermsItem />
                </Dropdown.Menu>
            </Dropdown>
        </>
    );
}
