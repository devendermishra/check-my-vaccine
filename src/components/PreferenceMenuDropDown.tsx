import { _T } from '../helpers/multilang'
import { Dropdown } from 'react-bootstrap'
import { SettingsItem } from './Settings';
import { FavoriteItem } from './FavoriteDialog';
import { DisclaimerItem } from './DisclaimerModal';


export default function PreferenceMenuDropDown() {
    return (
        <>
            <Dropdown>
                <Dropdown.Toggle variant="success" id="dropdown-basic">
                    {_T('PREFERENCES')}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                    <SettingsItem />
                    <FavoriteItem />
                    <Dropdown.Divider />
                    <DisclaimerItem />
                </Dropdown.Menu>
            </Dropdown>
        </>
    );
}
