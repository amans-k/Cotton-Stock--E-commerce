import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import { useRouter } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import Header from '@/components/Header'
import { Ionicons } from '@expo/vector-icons'
import { COLORS } from '@/constants'
import { useClerk } from '@clerk/clerk-expo'

const PROFILE_MENU = [
  { id: '1', title: 'My Orders', icon: 'bag-outline' },
  { id: '2', title: 'Shipping Address', icon: 'location-outline' },
  { id: '3', title: 'My Reviews', icon: 'star-outline' },
  { id: '4', title: 'Settings', icon: 'settings-outline' },
]

export default function Profile() {
  const { user, signOut } = useClerk();  // Changed from useClerk()
  const router = useRouter();

  const handleLogout = async () => {
    await signOut();
    router.replace('/(auth)/sign-in' as any)  // Fixed route
  }
  
  return (
   <SafeAreaView className='flex-1 bg-surface' edges={['top']}>
        <Header title='Profile'/>
        <ScrollView className='flex-1 px-4' contentContainerStyle={!user ? {flex:1, justifyContent:'center', alignItems:'center'}:{paddingTop: 16}}>
            {!user ? (
              //Guest User Screen
              <View className='items-center w-full'>
                <View className='w-24 h-24 rounded-full bg-gray-200 items-center justify-center mb-6'>
                   <Ionicons name='person' size={40} color={ COLORS.secondary}/>
                </View>
                <Text className='text-primary font-bold text-xl mb-2'> Guest User</Text>
                <Text className='text-secondary text-base mb-8 text-center w-3/4 px-4'> Login to view your profile, orders, and addresses.</Text>
                <TouchableOpacity onPress={()=> router.push('/(auth)/sign-in' as any)} className='bg-primary w-3/5 py-3 rounded-full items-center shadow-lg'>
                  <Text className='text-white font-bold text-lg'>Login / Sign Up</Text>
                </TouchableOpacity>
              </View>
            ):(
              <>
              {/* User Profile Info */}
              <View className='items-center mb-8'>
                <View className='mb-3'>
                 <Image source={{uri: user?.imageUrl}} className='w-20 h-20 rounded-full border-2 border-white shadow-sm'/>
                </View>
                <Text>{user?.firstName + " " + user?.lastName}</Text>
                <Text className='text-secondary text-sm'>{user?.emailAddresses?.[0]?.emailAddress}</Text>
                {/* Admin Panel Button if user is admin */}
                {user?.publicMetadata?.role === 'admin' &&(
                  <TouchableOpacity onPress={()=> router.push('/admin')} className='mt-4 bg-primary px-6 py-2 rounded-full'>
                     <Text className='text-white font-bold'>Admin Panel</Text>
                  </TouchableOpacity>
                )}
              </View>
              {/* Menu */}
              <View className='bg-white rounded-xl border border-gray-100/75 p-2 mb-4'>
              {PROFILE_MENU.map((item, index) => (
                <TouchableOpacity className={`flex-row items-center p-4 ${index !== PROFILE_MENU.length - 1 ? 'border-b border-gray-100' : ''}`} key={item.id}>
                     <View className='w-10 h-10 bg-surface rounded-full items-center justify-center mr-4'>
                      <Ionicons name={item.icon as any} size={20} color={COLORS.primary}/>
                     </View>
                     <Text className='flex-1 text-primary font-medium'>{item.title}</Text>
                       <Ionicons name='chevron-forward' size={20} color={COLORS.secondary}/>
                </TouchableOpacity>
              ))}
              </View>
              {/* Logout Button*/}
              <TouchableOpacity className='flex-row items-center justify-center p-4' onPress={handleLogout}>
                <Text className='text-red-500 font-bold ml-2'>Logout</Text>
              </TouchableOpacity>
              </>
            )}
        </ScrollView>
   </SafeAreaView>
  )
}