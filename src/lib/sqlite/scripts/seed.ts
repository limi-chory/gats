#!/usr/bin/env node

import { getDatabase, closeDatabase } from '../db'
import { v4 as uuidv4 } from 'uuid'
import bcrypt from 'bcrypt'

/**
 * 개발용 시드 데이터 생성
 */
async function seed() {
  console.log('Seeding database...')
  
  const db = getDatabase()
  
  // 기존 데이터 삭제
  console.log('Clearing existing data...')
  db.exec('DELETE FROM introduction_flows')
  db.exec('DELETE FROM path_requests')
  db.exec('DELETE FROM connections')
  db.exec('DELETE FROM network_nodes')
  db.exec('DELETE FROM contacts')
  db.exec('DELETE FROM users')
  
  // 샘플 사용자 생성
  console.log('Creating sample users...')
  
  const salt = await bcrypt.genSalt(10)
  
  const users = [
    {
      id: uuidv4(),
      clerk_user_id: 'clerk_test_user_1',
      phone_number: 'encrypted_01012345678',
      phone_hash: await bcrypt.hash('01012345678', salt),
      name: '김철수',
      company: '네이버',
      school: '서울대학교',
      interests: JSON.stringify(['개발', 'AI', '스타트업']),
      profile_visibility: 'public',
      user_salt: salt,
      is_verified: true,
    },
    {
      id: uuidv4(),
      clerk_user_id: 'clerk_test_user_2',
      phone_number: 'encrypted_01087654321',
      phone_hash: await bcrypt.hash('01087654321', salt),
      name: '이영희',
      company: '카카오',
      school: '연세대학교',
      interests: JSON.stringify(['디자인', 'UX', '프로덕트']),
      profile_visibility: 'public',
      user_salt: salt,
      is_verified: true,
    },
    {
      id: uuidv4(),
      clerk_user_id: 'clerk_test_user_3',
      phone_number: 'encrypted_01098765432',
      phone_hash: await bcrypt.hash('01098765432', salt),
      name: '박민수',
      company: '토스',
      school: '고려대학교',
      interests: JSON.stringify(['핀테크', '투자', '비즈니스']),
      profile_visibility: 'public',
      user_salt: salt,
      is_verified: true,
    },
  ]
  
  const insertUser = db.prepare(`
    INSERT INTO users (
      id, clerk_user_id, phone_number, phone_hash, name, company, school, 
      interests, profile_visibility, user_salt, is_verified
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `)
  
  users.forEach(user => {
    insertUser.run(
      user.id,
      user.clerk_user_id,
      user.phone_number,
      user.phone_hash,
      user.name,
      user.company,
      user.school,
      user.interests,
      user.profile_visibility,
      user.user_salt,
      user.is_verified ? 1 : 0
    )
    console.log(`  ✓ Created user: ${user.name}`)
  })
  
  // 샘플 연락처 생성 (첫 번째 사용자 기준)
  console.log('Creating sample contacts...')
  
  const contacts = [
    {
      id: uuidv4(),
      user_id: users[0].id,
      phone_hash: users[1].phone_hash,
      encrypted_phone: 'encrypted_01087654321',
      encrypted_name: 'encrypted_이영희',
      original_name: '영희',
      matched_user_id: users[1].id,
      tags: JSON.stringify(['친구', '대학동기']),
      synced_at: new Date().toISOString(),
    },
    {
      id: uuidv4(),
      user_id: users[0].id,
      phone_hash: users[2].phone_hash,
      encrypted_phone: 'encrypted_01098765432',
      encrypted_name: 'encrypted_박민수',
      original_name: '민수',
      matched_user_id: users[2].id,
      tags: JSON.stringify(['동료']),
      synced_at: new Date().toISOString(),
    },
  ]
  
  const insertContact = db.prepare(`
    INSERT INTO contacts (
      id, user_id, phone_hash, encrypted_phone, encrypted_name, 
      original_name, matched_user_id, tags, synced_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `)
  
  contacts.forEach(contact => {
    insertContact.run(
      contact.id,
      contact.user_id,
      contact.phone_hash,
      contact.encrypted_phone,
      contact.encrypted_name,
      contact.original_name,
      contact.matched_user_id,
      contact.tags,
      contact.synced_at
    )
    console.log(`  ✓ Created contact: ${contact.original_name}`)
  })
  
  console.log('\n✓ Seeding completed!')
  console.log(`Created ${users.length} users and ${contacts.length} contacts`)
}

seed()
  .then(() => {
    closeDatabase()
    process.exit(0)
  })
  .catch(error => {
    console.error('Seeding failed:', error)
    closeDatabase()
    process.exit(1)
  })

