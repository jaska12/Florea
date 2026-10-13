import { useTranslation } from 'next-i18next';
import React, { useCallback, useState } from 'react';
import { NextPage } from 'next';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import { Box, Button, Checkbox, FormControlLabel, FormGroup, Stack } from '@mui/material';
import { useRouter } from 'next/router';
import { logIn, signUp } from '../../libs/auth';
import { sweetMixinErrorAlert } from '../../libs/sweetAlert';
import { pageTranslations } from '../../libs/i18n/server';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await pageTranslations(locale, ['account'])),
	},
});

const Join: NextPage = () => {
	const { t } = useTranslation('account');
	const router = useRouter();
	const [input, setInput] = useState({ nick: '', password: '', phone: '', type: 'USER' });
	const [loginView, setLoginView] = useState<boolean>(true);

	/** HANDLERS **/
	const viewChangeHandler = (state: boolean) => {
		setLoginView(state);
	};

	const checkUserTypeHandler = (e: any) => {
		const checked = e.target.checked;
		if (checked) {
			const value = e.target.name;
			handleInput('type', value);
		} else {
			handleInput('type', 'USER');
		}
	};

	const handleInput = useCallback((name: any, value: any) => {
		setInput((prev) => {
			return { ...prev, [name]: value };
		});
	}, []);

	const doLogin = useCallback(async () => {
		console.warn(input);
		try {
			await logIn(input.nick, input.password);
			await router.push(`${router.query.referrer ?? '/'}`);
		} catch (err: any) {
			await sweetMixinErrorAlert(err.message);
		}
	}, [input]);

	const doSignUp = useCallback(async () => {
		console.warn(input);
		try {
			await signUp(input.nick, input.password, input.phone, input.type);
			await router.push(`${router.query.referrer ?? '/'}`);
		} catch (err: any) {
			await sweetMixinErrorAlert(err.message);
		}
	}, [input]);

	console.log('+input: ', input);

	return (
		<Stack className={'join-page'}>
			<Stack className={'container'}>
				<Stack className={'main'}>
					<Stack className={'left'}>
						{/* @ts-ignore */}
						<Box className={'logo'}>
							<img src="/img/logo/florea/florea-mark.svg" alt="Florea" />
							<span>Florea</span>
						</Box>
						<Box className={'info'}>
							<span>{loginView ? t('join.loginWord') : t('join.signupWord')}</span>
							<p>{loginView ? t('join.loginHint') : t('join.signupHint')}</p>
						</Box>
						<Box className={'input-wrap'}>
							<div className={'input-box'}>
								<span>{t('join.nickname')}</span>
								<input
									type="text"
									placeholder={t('join.enterNickname')}
									onChange={(e) => handleInput('nick', e.target.value)}
									required={true}
									onKeyDown={(event) => {
										if (event.key == 'Enter' && loginView) doLogin();
										if (event.key == 'Enter' && !loginView) doSignUp();
									}}
								/>
							</div>
							<div className={'input-box'}>
								<span>{t('join.password')}</span>
								<input
									type="password"
									autoComplete={loginView ? 'current-password' : 'new-password'}
									placeholder={t('join.enterPassword')}
									onChange={(e) => handleInput('password', e.target.value)}
									required={true}
									onKeyDown={(event) => {
										if (event.key == 'Enter' && loginView) doLogin();
										if (event.key == 'Enter' && !loginView) doSignUp();
									}}
								/>
							</div>
							{!loginView && (
								<div className={'input-box'}>
									<span>{t('join.phone')}</span>
									<input
										type="text"
										placeholder={t('join.enterPhone')}
										onChange={(e) => handleInput('phone', e.target.value)}
										required={true}
										onKeyDown={(event) => {
											if (event.key == 'Enter') doSignUp();
										}}
									/>
								</div>
							)}
						</Box>
						<Box className={'register'}>
							{!loginView && (
								<div className={'type-option'}>
									<span className={'text'}>{t('join.iWantToBeRegistered')}</span>
									<div>
										<FormGroup>
											<FormControlLabel
												control={
													<Checkbox
														size="small"
														name={'USER'}
														onChange={checkUserTypeHandler}
														checked={input?.type == 'USER'}
													/>
												}
												label={t('join.user')}
											/>
										</FormGroup>
										<FormGroup>
											<FormControlLabel
												control={
													<Checkbox
														size="small"
														name={'AGENT'}
														onChange={checkUserTypeHandler}
														checked={input?.type == 'AGENT'}
													/>
												}
												label={t('join.agent')}
											/>
										</FormGroup>
									</div>
								</div>
							)}

							{loginView && (
								<div className={'remember-info'}>
									<FormGroup>
										<FormControlLabel control={<Checkbox defaultChecked size="small" />} label={t('join.rememberMe')} />
									</FormGroup>
									<a>{t('join.lostYourPassword')}</a>
								</div>
							)}

							{loginView ? (
								<Button
									variant="contained"
									endIcon={<img src="/img/icons/rightup.svg" alt="" />}
									disabled={input.nick == '' || input.password == ''}
									onClick={doLogin}
								>
									{t('join.login')}
								</Button>
							) : (
								<Button
									variant="contained"
									disabled={input.nick == '' || input.password == '' || input.phone == '' || input.type == ''}
									onClick={doSignUp}
									endIcon={<img src="/img/icons/rightup.svg" alt="" />}
								>
									{t('join.signup')}
								</Button>
							)}
						</Box>
						<Box className={'ask-info'}>
							{loginView ? (
								<p>
									{t('join.notRegisteredYet')}
									<b
										onClick={() => {
											viewChangeHandler(false);
										}}
									>
										{t('join.signup')}
									</b>
								</p>
							) : (
								<p>
									{t('join.haveAccount')}
									<b onClick={() => viewChangeHandler(true)}> {t('join.login')}</b>
								</p>
							)}
						</Box>
					</Stack>
					<Stack className={'right'}></Stack>
				</Stack>
			</Stack>
		</Stack>
	);
};

export default withLayoutBasic(Join);
