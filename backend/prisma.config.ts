import { defineConfig } from '@prisma/config'

export default defineConfig({
    earlyAccessFeatures: {
        driverAdapters: {
            sqlite: true,
        },
    },
    datasource: {
        url: process.env.DATABASE_URL!,
    },
})