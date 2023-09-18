import React from 'react'

const UserContext = React.createContext({
    user: {} as any,
    logIn: async (username: string, password: string): Promise<any> => null,
    logout: (): any => null,
    resetPassword: async (oldPassword: string, newPassword: string): Promise<any> => null, 
    refreshLogIn: (refresh_token: string): any => null
})

export const UserProvider = UserContext.Provider
export const UserConsumer = UserContext.Consumer

export default UserContext
