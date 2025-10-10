#!/usr/bin/env node

import { runMigrations, checkMigrationStatus, closeDatabase } from '../db'

const command = process.argv[2]

switch (command) {
  case 'up':
    console.log('Running migrations...')
    runMigrations()
    break
  
  case 'status':
    checkMigrationStatus()
    break
  
  default:
    console.log('Usage:')
    console.log('  npm run db:migrate up     - Run all pending migrations')
    console.log('  npm run db:migrate status - Check migration status')
    process.exit(1)
}

closeDatabase()

