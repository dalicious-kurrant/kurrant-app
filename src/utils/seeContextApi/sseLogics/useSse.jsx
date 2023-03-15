import RNEventSource from 'react-native-event-source';
import {useCallback, useEffect, useMemo, useState} from 'react';
import {Text, View} from 'react-native';
import {getStorage, setStorage} from '../../asyncStorage';
import {getCheck} from '../restApis/getRestApis';
import Config from 'react-native-config';

const apiHostUrl =
  Config.NODE_ENV === 'dev'
    ? Config.API_DEVELOP_URL + '/' + Config.API_VERSION
    : Config.API_HOST_URL + '/' + Config.API_VERSION;

const useSse = () => {
  const [eventSource, setEventSource] = useState('');

  const [eventSourceMsg, setEventSourceMsg] = useState({});

  const setSse = useCallback(async () => {
    const token = await getStorage('token');

    let yo;
    if (token) {
      yo = JSON.parse(token);
      console.log(token);
    }

    // console.log(yo?.accessToken);

    let eventSourceYo = new RNEventSource(
      `${apiHostUrl}/notification/subscribe`,

      {
        headers: {
          Authorization: `Bearer ${yo?.accessToken}`,
        },
        withCredentials: true,
      },
    );

    setEventSource(eventSourceYo);
  }, [setEventSource]);

  useEffect(() => {
    setSse();
    // getCheck('2023-02-06', '2023-02-10');
  }, []);
  useEffect(() => {
    return () => {
      console.log(`server closed connection`);
      if (eventSource) eventSource.close();
    };
  }, []);

  if (!eventSource) {
    return {evetnSourceMsg: undefined};
  }

  console.log('sse 열림 잘 들어옴');
  eventSource.addEventListener('message', e => {
    // console.log(JSON.parse(e.data));

    setEventSourceMsg(e.data);

    console.log('addEventLister 여기여 ' + e.data);
  });
  eventSource.onopen = event => {
    console.log(event);
    console.log('hi i am open');
  };
  eventSource.onmessage = e => {
    console.log('오 성공? ㅋㅋ');
    // console.log(JSON.parse(e.data));
    console.log(e.data);
    // console.log("onmessage" + e.data);
    // setMessages([...messages, event.data]);
  };
  eventSource.onerror = () => {
    // setMessages([...messages, "Server closed connection"]);
    console.log(`server closed connection`);
    eventSource.close();
  };

  return {eventSourceMsg};
};

export default useSse;
