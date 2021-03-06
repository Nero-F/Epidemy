require('dotenv').config();

const graph = require('@microsoft/microsoft-graph-client');
require('isomorphic-fetch');

const getAuthenticatedClient = (accessToken) => {
    const client = graph.Client.init({
        authProvider: (done) => {
          done(null, accessToken);
        }
    });

    return client;
};

const getUserDetails = async (accessToken) => {
    const client = getAuthenticatedClient(accessToken);
    const user = await client.api('/me').get();

    return user;
};

// Should give availiability in the current week

const getTimeObjFromDateTimes = (start, end) => {
    const date1 = new Date(start)
    const date2 = new Date(end)

    return {
        day: new Intl.DateTimeFormat('fr-FR', {weekday: 'long'}).format(date1),
        time: `${Intl.DateTimeFormat('default',
            {
                hour: 'numeric',
                minute: 'numeric',
                second: 'numeric'
            }).format(date1)} - ${Intl.DateTimeFormat('default',
            {
                hour: 'numeric',
                minute: 'numeric',
                second: 'numeric'
            }).format(date2)}`
    };
}

// TODO: improve this part
const getAllDataSet = async (linkToNextSet, client) => {
    let buffer = [];

    if (linkToNextSet.length === 0)
        return;
    try {
        const response = await client.api(linkToNextSet)
            .get();
        buffer = response.value;
        const nextLink = response['@odata.nextLink'];

        if (nextLink !== undefined) return buffer.concat(await getAllDataSet(nextLink, client));
        return buffer;
    } catch (err) {
        console.error(err);
    }
}

const getWeekAERAvailiabityByName = async (accessToken, name) => {
    const date = new Date();
    const today = date.toISOString();
    const buffer = date.getDate() - (date.getDay() - 1) + 6;
    const last_day = new Date(date.setDate(buffer)).toISOString();
    const client = getAuthenticatedClient(accessToken);

    // Check the good url endpoint
    console.log(`/me/calendars/${process.env.ID_AER_CALENDAR}/calendarView?startDateTime=${today}&endDateTime=${last_day}`);

    try {
        const response = await client.api(`/me/calendars/${process.env.ID_AER_CALENDAR}/calendarView?startDateTime=${today}&endDateTime=${last_day}`)
            .select('subject,start,end')
            .get();
        let retValue = [];
        let clear = response.value;
        clear = clear.concat(await getAllDataSet(response['@odata.nextLink'] === undefined ? "" : response['@odata.nextLink'], client));
        clear.forEach(elem => {
            let str_tab = elem?.subject.split('-').map(arr => arr.trim());

            if (str_tab && str_tab[0].toLowerCase() == name.toLowerCase())
                retValue.push(elem);
        });
        return retValue;
    } catch (err) {
        console.error(err);
        throw 'Can\'t retreive Infos... <Graph error>';
    }
};

const getAERTimeSheet = async (accessToken) => { 
    const client = getAuthenticatedClient(accessToken);
    let res = await client.api(`/me/calendars/${process.env.ID_AER_CALENDAR}/events`)
        .select('subject,organizer,start,end')
        .get();
    return res;
}

const getEvents = async (accessToken) => {
    const client = getAuthenticatedClient(accessToken);
    const events = await client
      .api('/me/events')
      .select('subject,organizer,start,end')
      .orderby('createdDateTime DESC')
      .get();

    return events;
};

module.exports = {
    getUserDetails,
    getEvents,
    getWeekAERAvailiabityByName,
    getAERTimeSheet
};
