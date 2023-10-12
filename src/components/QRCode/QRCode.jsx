import React, {useEffect, useState} from 'react';
import {Modal, View, ActivityIndicator} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import styled from 'styled-components';

import RestartIcon from '../../assets/icons/Home/restart.svg';
import XIcon from '../../assets/icons/Home/x.svg';
import {useGetQR} from '../../hook/useQr';
import {formattedTimer} from '../../utils/dateFormatter';
import Typography from '../Typography';

const QRCodeComponent = ({modal, setModal, orderId, setOrderId}) => {
  const [click, setClick] = useState(false);
  const [isQRCodeEnabled, setIsQRCodeEnabled] = useState(true);
  const [timer, setTimer] = useState(180);
  const [intervalId, setIntervalId] = useState(null);
  const {data: qrData, refetch, isFetching} = useGetQR(orderId, modal);

  const jsonString = JSON.stringify(qrData?.data);

  const reloadQRCode = () => {
    setIsQRCodeEnabled(true);
    setTimer(180);
    startTimer();
    setClick(true);
  };

  const startTimer = () => {
    let id = setInterval(() => {
      setTimer(prevTimer => {
        if (prevTimer <= 0) {
          setIsQRCodeEnabled(false);
          clearInterval(id);
          setClick(false);

          return 0;
        }
        return prevTimer - 1;
      });
    }, 1000);
    setIntervalId(id);
  };

  useEffect(() => {
    if (modal) {
      setIsQRCodeEnabled(true);
      setTimer(180);
      startTimer();
    } else {
      setIsQRCodeEnabled(false);
      clearInterval(intervalId);
      setOrderId(null);
    }

    return () => {
      clearInterval(intervalId);
    };
  }, [modal]);

  useEffect(() => {
    if (orderId && click) {
      refetch();
    }
  }, [refetch, orderId, click]);

  return (
    <View>
      <Modal presentationStyle={'fullScreen'} visible={modal}>
        <ModalWrap onPress={() => setModal(false)}>
          <ModalContentWrap>
            <CloseButton onPress={() => setModal(false)}>
              <XIcon />
            </CloseButton>
            <QRView>
              {isFetching ? (
                <ActivityIndicator size={'large'} style={{flex: 1}} />
              ) : (
                <QRCode
                  color={isQRCodeEnabled ? '#1D1C21' : '#F2F2F2'}
                  value={jsonString}
                  size={196}
                  logoBackgroundColor="transparent"
                />
              )}
              {!isQRCodeEnabled && (
                <ReStartView onPress={reloadQRCode}>
                  <RestartIcon />
                </ReStartView>
              )}
            </QRView>
            <TimeView>
              {isFetching ? null : isQRCodeEnabled ? (
                <TimerText>{formattedTimer(timer)}</TimerText>
              ) : (
                <DisabledTimerText>
                  인증 시간이 만료되었습니다.
                </DisabledTimerText>
              )}
            </TimeView>
          </ModalContentWrap>
        </ModalWrap>
      </Modal>
    </View>
  );
};

export default QRCodeComponent;

// 나머지 스타일 및 컴포넌트는 이전과 동일합니다.

const ModalWrap = styled.Pressable`
  background-color: rgba(0, 0, 0, 0.7);
  padding: 0px 24px;
  justify-content: center;
  flex: 1;
`;

const ModalContentWrap = styled.View`
  background-color: white;
  border-radius: 14px;
  height: 327px;
  padding: 66px 65px 65px 65px;
  align-items: center;
`;

const QRView = styled.View`
  position: relative;
  align-items: center;
  justify-content: center;
`;
const CloseButton = styled.Pressable`
  position: absolute;
  right: 16px;
  top: 16px;
`;

const TimeView = styled.View`
  margin-top: 8px;
`;

const TimerText = styled(Typography).attrs({text: 'CaptionR'})`
  color: ${({theme}) => theme.colors.blue[500]};
  width: 50px;
  text-align: center;
`;

const DisabledTimerText = styled(Typography).attrs({text: 'CaptionR'})`
  color: ${({theme}) => theme.colors.grey[5]};
`;

const ReStartView = styled.Pressable`
  position: absolute;
`;
