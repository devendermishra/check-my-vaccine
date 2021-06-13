import { _T } from '../helpers/multilang'
import { Dropdown } from 'react-bootstrap'
import { SettingsItem } from './Settings'
import { FavoriteItem } from './FavoriteDialog'
import { DisclaimerItem } from './DisclaimerModal'
import { InstructionsItem } from './Instructions'
import { TermsItem } from './TermsConditions'
import MenuIcon from '@material-ui/icons/Menu'
import GitHubIcon from '@material-ui/icons/GitHub'

export default function PreferenceMenuDropDown() {
    return (
        <>
            <Dropdown style={{paddingTop: '10px'}}>
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
                    <Dropdown.Divider />
                    <Dropdown.Item href="https://github.com/devendermishra/check-my-vaccine"><GitHubIcon />&nbsp;{_T('CODE_SOURCE')}
    </Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
        </>
    );
}
