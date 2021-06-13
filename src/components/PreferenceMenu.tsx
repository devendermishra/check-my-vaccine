import React from 'react'
import Button from '@material-ui/core/Button'
import Menu from '@material-ui/core/Menu'
import MenuIcon from '@material-ui/icons/Menu'
import { _T } from '../helpers/multilang'
import { SettingsMenu } from './Settings'
import { FavoriteMenu } from './FavoriteDialog'
import { DisclaimerMenu } from './DisclaimerModal'
import { Divider } from '@material-ui/core'


export default function PreferenceMenu() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Button aria-controls="preference-menu"
        aria-haspopup="true"
        variant="outlined"
        style={{ float: "left", backgroundColor: "lightgray" }}
        startIcon={<MenuIcon color="primary" />}
        onClick={handleClick}>
        {_T('PREFERENCES')}
      </Button> <br/>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <SettingsMenu menuCallback={handleClose} />
        <FavoriteMenu menuCallback={handleClose} />
        <Divider />
        <DisclaimerMenu menuCallback={handleClose} />
      </Menu>
    </>
  );
}
