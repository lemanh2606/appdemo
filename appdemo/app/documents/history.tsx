import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

interface HistoryItemProps {
  initials: string;
  role: string;
  name: string;
  time: string;
  status?: string;
  action?: string;
  target?: string;
  comment?: string;
}

const HistoryItem = ({ initials, role, name, time, status, action, target, comment }: HistoryItemProps) => (
  <View style={styles.itemContainer}>
    <View style={styles.avatarContainer}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{initials}</Text>
      </View>
    </View>
    <View style={styles.itemContent}>
      <Text style={styles.roleText}>{role}</Text>
      <Text style={styles.nameText}>{name}</Text>
      
      <View style={styles.statusRow}>
        {status === 'Kết thúc' ? (
          <View style={styles.statusBadge}>
            <Ionicons name="checkmark-circle-outline" size={16} color="#10B981" />
            <Text style={styles.statusText}>Kết thúc</Text>
          </View>
        ) : (
          <View style={styles.actionBadge}>
            <Ionicons name="arrow-forward-circle-outline" size={16} color="#2563EB" />
            <Text style={styles.actionText}>
              <Text style={{ color: '#2563EB' }}>{action} </Text>
              {target}
            </Text>
          </View>
        )}
        <View style={styles.timeContainer}>
          <Ionicons name="time-outline" size={14} color="#9CA3AF" />
          <Text style={styles.timeText}>{time}</Text>
        </View>
      </View>

      {comment && (
        <View style={styles.commentBox}>
          <Text style={styles.commentText}>{comment}</Text>
        </View>
      )}
    </View>
  </View>
);

export default function HistoryScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const HISTORY_DATA: HistoryItemProps[] = [
    {
      initials: 'PNL',
      role: 'Chuyên viên phòng hành chính',
      name: 'Phan Ngọc Linh',
      time: '5 giờ trước',
      status: 'Kết thúc',
    },
    {
      initials: 'PNT',
      role: 'Cục trưởng Bộ công an',
      name: 'Nguyễn Ngọc Trâm',
      time: '5 giờ trước',
      action: 'Chuyển xử lý',
      target: 'Nguyễn Hà Anh (Chủ trì) và 3 người khác',
      comment: 'Nội dung ý kiến của lãnh đạo và các phòng ban chức năng',
    },
    {
      initials: 'NAH',
      role: 'Lãnh đạo cục quản lý đấu thầu',
      name: 'Nguyễn Thị Anh Huyền',
      time: '5 giờ trước',
      action: 'Chuyển xử lý',
      target: 'Nguyễn Hà Anh (Chủ trì) và 3 người khác',
    },
    {
      initials: 'NHH',
      role: 'Chuyên viên phòng hành chính',
      name: 'Nguyễn Thị Ngọc Hà',
      time: '5 giờ trước',
      status: 'Kết thúc',
    },
    {
      initials: 'PML',
      role: 'Chuyên viên phòng hành chính',
      name: 'Phạm Mai Linh',
      time: '01/01/2026 14:20',
      status: 'Kết thúc',
    },
    {
      initials: 'LHT',
      role: 'Chuyên viên phòng hành chính',
      name: 'Lê Hoàng Tùng',
      time: '28/12/2025 11:00',
      status: 'Kết thúc',
    },
    {
      initials: 'NTS',
      role: 'Chuyên viên phòng hành chính',
      name: 'Nguyễn Tiến Sơn',
      time: '25/12/2025 09:30',
      status: 'Kết thúc',
    },
  ];

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#2563EB" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Lịch sử xử lý</Text>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentPadding}>
        {HISTORY_DATA.map((item, index) => (
          <HistoryItem key={index} {...item} />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginLeft: 16,
  },
  content: {
    flex: 1,
  },
  contentPadding: {
    paddingBottom: 40,
  },
  itemContainer: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  avatarContainer: {
    marginRight: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#374151',
  },
  itemContent: {
    flex: 1,
  },
  roleText: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 2,
  },
  nameText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statusText: {
    fontSize: 13,
    color: '#10B981',
    fontWeight: '500',
  },
  actionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flex: 1,
  },
  actionText: {
    fontSize: 13,
    color: '#374151',
    fontWeight: '500',
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  timeText: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  commentBox: {
    marginTop: 10,
    padding: 12,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  commentText: {
    fontSize: 13,
    color: '#374151',
    lineHeight: 18,
  },
});
