/*

User:
    id, 
    name,
    phone
    address
    zip


Goods:
    id,
    name,
    desription,
    price,
    image,


Ordres:
    id,
    description
    postAddress,
    telephone,
    status
    totalAmount,
    memo

goodsOrder:
    orderId,
    goodsId,
    date,
    number, //多少件商品


Image
    id,
    name
    description,
    price,
    memo,
    copies //多少份打印

ImageOrders:
    imageId,
    orderId


AccessToken:
    orderId,
    accessToken,
    expiry 


*/


/*
1. user - order
2. order
3. picture

*/

/**
Picture
    id, 
    name, 
    description,
    location,
    

order 
    id,
    pdd_order_number,
    date_create,
    date_complete,
    date_delete,
    status,


order_picture,
    picture_id,
    order_id,
    copies,
    size,
    status,


post_addr
    address,
    address_details,

user_access_token:
    order_id,
    access_token,
    expires
*/


insert into post_addr(id, address, addr_details) values (1, "上海市浦东新区", "上海市浦东新区123号");
insert into post_addr(id, address, addr_details) values (2, "南京市江宁区", "南京市江宁区北京路185号");


insert into orders (id, pdd_order_number, num_photos, post_addr, title, description) values (1, '123456789', 10, 1, '打印美照', '特别好看的照片，特别周到的服务质量！');
insert into orders (id, pdd_order_number, num_photos, post_addr, title, description) values (2, '223456789', 10, 2, "打印美照", '特别好看的照片，特别周到的服务质量！');

insert into users (name, login_name, login_type, allow_login, pwd, user_type) values ('管理员', 'admin', 'usernamepwd', 1, '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918', 'admin'); 