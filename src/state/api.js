import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";


export const api = createApi({
    baseQuery: fetchBaseQuery({ baseUrl: `${process.env.REACT_APP_BASE_URL}`,
                credentials: "include",
                crossDomain: true,
                headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                'Access-Control-Allow-Origin': `${process.env.REACT_APP_BASE_URL}`,
                },
            }),
    reducePath: "adminApi",
    tagTypes: ["User", "AuthUser","Products", "Customers", "Transactions", "Geography", "Sales", "Admins", "Performance", "Dashboard"],
    endpoints: (build) => ({
        getAuthUser: build.query({ 
            query: () => `general/authUser`,
            providesTags: ["AuthUser"]
        }),
        getLocationAndLanguages: build.query({ 
            query: () => `general/locationAndLanguages`,
            providesTags: ["LocationAndLanguages"]
        }),
        getUser: build.query({ 
            query: (id) => `general/user/${id}`,
            providesTags: ["User"]
        }),
        getProducts: build.query({ 
            query: () => "client/products",
            providesTags: ["Products"]
        }),
        getCustomers: build.query({ 
            query: () => "client/customers",
            providesTags: ["Customers"]
        }),
        getTransactions: build.query({ 
            query: ({ page, pageSize, sort, search }) => ({
                url:"client/transactions",
                method: "GET",
                params: { page, pageSize, sort, search},
            }),
            providesTags: ["Transactions"]
        }),
        getGeography: build.query({ 
            query: () => "client/geography",
            providesTags: ["Geography"]
        }),
        getSales: build.query({ 
            query: () => "sales/sales",
            providesTags: [ "Sales" ]
        }),
        getSearchSales: build.query({ 
            query: (searchString) => ({
                url: `sales/searchSales/`,
                method: "GET",
                params: {searchString: JSON.stringify(searchString)}
            }),
            providesTags: [ "SalesSearch" ],
        }),
        getAdmins: build.query({ 
            query: () => "management/admins",
            providesTags: ["Admins"]
        }),
        getUserPerformance: build.query({
            query: (id) => `management/performance/${id}`,
            providesTags: ["Performance"]
        }),
        getDashboard: build.query({
            query: (id) => "general/dashboard",
            provideTags: ["Dashboard"],
        })
    })
})

export const { useGetUserQuery, useGetLocationAndLanguagesQuery, useGetAuthUserQuery, useGetProductsQuery, useGetCustomersQuery, useGetTransactionsQuery, useGetGeographyQuery,
    useGetSalesQuery, useGetSearchSalesQuery, useGetAdminsQuery, useGetUserPerformanceQuery, useGetDashboardQuery } = api;