import React, { useCallback, useEffect, useRef } from 'react';
import { useState } from 'react';
import { useRouter, withRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { getJwtToken, logOut, updateUserInfo } from '../auth';
import { Stack, Box } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import { alpha, styled } from '@mui/material/styles';
import Menu, { MenuProps } from '@mui/material/Menu';
import Drawer from '@mui/material/Drawer';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import { CaretDown } from 'phosphor-react';
import Link from 'next/link';
import NotificationBell from './common/NotificationBell';
import CartIcon from './common/CartIcon';
import { refreshSocket } from '../socket';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../apollo/store';
import { Logout } from '@mui/icons-material';
import { REACT_APP_API_URL } from '../config';
import { LOCALES } from '../i18n/locale';
import { rememberLocale } from '../i18n/memory';

const Top = () => {
	const user = useReactiveVar(userVar);
	const { t, i18n } = useTranslation('common');
	const router = useRouter();
	const [anchorEl2, setAnchorEl2] = useState<null | HTMLElement>(null);
	// the language of the page is the one in the address; the flag follows it
	const lang = router.locale ?? 'en';
	const drop = Boolean(anchorEl2);
	const [colorChange, setColorChange] = useState(false);
	const [anchorEl, setAnchorEl] = React.useState<any | HTMLElement>(null);
	let open = Boolean(anchorEl);
	const [bgColor, setBgColor] = useState<boolean>(false);
	const [logoutAnchor, setLogoutAnchor] = React.useState<null | HTMLElement>(null);
	const logoutOpen = Boolean(logoutAnchor);
	// the slide-in menu that replaces the row of links on phones and tablets
	const [drawerOpen, setDrawerOpen] = useState<boolean>(false);

	/** LIFECYCLES **/
	useEffect(() => {
		switch (router.pathname) {
			case '/product/detail':
				setBgColor(true);
				break;
			default:
				break;
		}
	}, [router]);

	useEffect(() => {
		const jwt = getJwtToken();
		if (jwt) updateUserInfo(jwt);
	}, []);

	useEffect(() => {
		// after a login without a page reload the socket still belongs to a guest
		refreshSocket();
	}, [user?._id]);

	useEffect(() => {
		setDrawerOpen(false);
	}, [router.asPath]);

	/** HANDLERS **/
	const langClick = (e: any) => {
		setAnchorEl2(e.currentTarget);
	};

	const langClose = () => {
		setAnchorEl2(null);
	};

	const langChoice = useCallback(
		async (code: string) => {
			rememberLocale(code);
			setAnchorEl2(null);
			await router.push(router.asPath, router.asPath, { locale: code });
		},
		[router],
	);

	const changeNavbarColor = () => {
		if (window.scrollY >= 50) {
			setColorChange(true);
		} else {
			setColorChange(false);
		}
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	const handleHover = (event: any) => {
		if (anchorEl !== event.currentTarget) {
			setAnchorEl(event.currentTarget);
		} else {
			setAnchorEl(null);
		}
	};

	const StyledMenu = styled((props: MenuProps) => (
		<Menu
			elevation={0}
			anchorOrigin={{
				vertical: 'bottom',
				horizontal: 'right',
			}}
			transformOrigin={{
				vertical: 'top',
				horizontal: 'right',
			}}
			{...props}
		/>
	))(({ theme }) => ({
		'& .MuiPaper-root': {
			top: '109px',
			borderRadius: 6,
			marginTop: theme.spacing(1),
			minWidth: 160,
			color: theme.palette.mode === 'light' ? 'rgb(55, 65, 81)' : theme.palette.grey[300],
			boxShadow:
				'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
			'& .MuiMenu-list': {
				padding: '4px 0',
			},
			'& .MuiMenuItem-root': {
				'& .MuiSvgIcon-root': {
					fontSize: 18,
					color: theme.palette.text.secondary,
					marginRight: theme.spacing(1.5),
				},
				'&:active': {
					backgroundColor: alpha(theme.palette.primary.main, theme.palette.action.selectedOpacity),
				},
			},
		},
	}));

	if (typeof window !== 'undefined') {
		window.addEventListener('scroll', changeNavbarColor);
	}

	return (
		<Stack className={'navbar'}>
			<Stack className={`navbar-main ${colorChange ? 'transparent' : ''} ${bgColor ? 'transparent' : ''}`}>
				<Stack className={'container'}>
					<button
						type={'button'}
						className={'nav-toggle'}
						aria-label={t('nav.menu')}
						aria-expanded={drawerOpen}
						onClick={() => setDrawerOpen(true)}
					>
						<MenuRoundedIcon />
					</button>
					<Box component={'div'} className={'logo-box'}>
						<Link href={'/'}>
							<img src="/img/logo/florea/florea-logo-on-dark.svg" alt="Florea" />
						</Link>
					</Box>
					<Box component={'div'} className={'router-box'}>
						<Link href={'/'}>
							<div>{t('nav.home')}</div>
						</Link>
						<Link href={'/product'}>
							<div>{t('nav.products')}</div>
						</Link>
						<Link href={'/agent'}>
							<div> {t('nav.florists')} </div>
						</Link>
						<Link href={'/community?articleCategory=FREE'}>
							<div> {t('nav.community')} </div>
						</Link>
						{user?._id && (
							<Link href={'/mypage'}>
								<div> {t('nav.myPage')} </div>
							</Link>
						)}
						<Link href={'/cs'}>
							<div> {t('nav.cs')} </div>
						</Link>
					</Box>
					<Box component={'div'} className={'user-box'}>
						{user?._id ? (
							<>
								<div className={'login-user'} onClick={(event: any) => setLogoutAnchor(event.currentTarget)}>
									<img
										src={
											user?.memberImage && !user.memberImage.startsWith('/img/')
												? `${REACT_APP_API_URL}/${user?.memberImage}`
												: '/img/profile/defaultUser.svg'
										}
										alt=""
									/>
								</div>

								<Menu
									id="basic-menu"
									anchorEl={logoutAnchor}
									open={logoutOpen}
									onClose={() => {
										setLogoutAnchor(null);
									}}
									sx={{ mt: '5px' }}
								>
									<MenuItem onClick={() => logOut()}>
										<Logout fontSize="small" style={{ color: 'blue', marginRight: '10px' }} />
										{t('nav.logout')}
									</MenuItem>
								</Menu>
							</>
						) : (
							<Link href={'/account/join'}>
								<div className={'join-box'}>
									<AccountCircleOutlinedIcon />
									<span>
										{t('nav.loginRegister')}
									</span>
								</div>
							</Link>
						)}

						<div className={'lan-box'}>
							<CartIcon />
						{user?._id && <NotificationBell />}
							<Button
								disableRipple
								className="btn-lang"
								onClick={langClick}
								endIcon={<CaretDown size={14} color="#616161" weight="fill" />}
							>
								<Box component={'div'} className={'flag'}>
									<img src={`/img/flag/lang${lang}.png`} alt={t('nav.language')} />
								</Box>
							</Button>

							<StyledMenu anchorEl={anchorEl2} open={drop} onClose={langClose} sx={{ position: 'absolute' }}>
								{LOCALES.map((code) => (
									<MenuItem disableRipple onClick={() => langChoice(code)} selected={lang === code} key={code}>
										<img className="img-flag" src={`/img/flag/lang${code}.png`} alt={''} />
										{t(`nav.languageName.${code}`)}
									</MenuItem>
								))}
							</StyledMenu>
						</div>
					</Box>
				</Stack>
			</Stack>

			<Drawer
				anchor={'left'}
				open={drawerOpen}
				onClose={() => setDrawerOpen(false)}
				PaperProps={{ className: 'florea-nav-drawer' }}
			>
				<div className={'drawer-head'}>
					<Link href={'/'}>
						<img src="/img/logo/florea/florea-logo.svg" alt="Florea" />
					</Link>
					<button type={'button'} aria-label={t('nav.closeMenu')} onClick={() => setDrawerOpen(false)}>
						<CloseRoundedIcon />
					</button>
				</div>
				<nav className={'drawer-links'}>
					<Link href={'/'} className={router.pathname === '/' ? 'on' : ''}>
						{t('nav.home')}
					</Link>
					<Link href={'/product'} className={router.pathname.startsWith('/product') ? 'on' : ''}>
						{t('nav.products')}
					</Link>
					<Link href={'/agent'} className={router.pathname.startsWith('/agent') ? 'on' : ''}>
						{t('nav.florists')}
					</Link>
					<Link href={'/community?articleCategory=FREE'} className={router.pathname.startsWith('/community') ? 'on' : ''}>
						{t('nav.community')}
					</Link>
					{user?._id && (
						<Link href={'/mypage'} className={router.pathname.startsWith('/mypage') ? 'on' : ''}>
							{t('nav.myPage')}
						</Link>
					)}
					<Link href={'/cs'} className={router.pathname.startsWith('/cs') ? 'on' : ''}>
						{t('nav.cs')}
					</Link>
				</nav>
				<div className={'drawer-lang'}>
					{LOCALES.map((code) => (
						<button
							type={'button'}
							key={code}
							className={lang === code ? 'on' : ''}
							aria-label={t(`nav.languageName.${code}`)}
							aria-pressed={lang === code}
							onClick={() => langChoice(code)}
						>
							<img src={`/img/flag/lang${code}.png`} alt={''} />
							{code.toUpperCase()}
						</button>
					))}
				</div>
				<div className={'drawer-foot'}>
					{user?._id ? (
						<button type={'button'} className={'drawer-btn ghost'} onClick={() => logOut()}>
							<Logout fontSize="small" />
							{t('nav.logout')}
						</button>
					) : (
						<Link href={'/account/join'} className={'drawer-btn'}>
							{t('nav.loginRegister')}
						</Link>
					)}
				</div>
			</Drawer>
		</Stack>
	);
};

export default withRouter(Top);
