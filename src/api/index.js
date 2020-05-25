import request from '../utils/request';

export const fetchproduct_Data = query => {
    return request({
        url: './product.json',
        method: 'get',
        params: query
    });
};

export const fetchequip_Data = query => {
    return request({
        url: './equip.json',
        method: 'get',
        params: query
    });
};
export const fetchorder_Data = query => {
    return request({
        url: './order.json',
        method: 'get',
        params: query
    });
};

export const fetchdispatch_Data = query => {
    return request({
        url: './dispatch.json',
        method: 'get',
        params: query
    });
};

export const fetchemployee_Data = query => {
    return request({
        url: './employee.json',
        method: 'get',
        params: query
    });
};

export const fetchplan_Data = query => {
    return request({
        url: './plan.json',
        method: 'get',
        params: query
    });
};

export const fetchtrack_Data = query => {
    return request({
        url: './track.json',
        method: 'get',
        params: query
    });
};

export const fetchnotification_Data = query => {
    return request({
        url: './notification.json',
        method: 'get',
        params: query
    });
};



