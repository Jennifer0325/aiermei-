import React, { useState, useEffect, useRef } from 'react';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Home, 
  LayoutGrid, 
  User, 
  ChevronRight, 
  Play, 
  Heart, 
  MessageCircle, 
  Calendar, 
  ShoppingBag, 
  Utensils, 
  Headset, 
  Lock, 
  X,
  TrendingUp,
  Users,
  BarChart3,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { cn } from './lib/utils';
import { analyzeUserBehavior } from './services/agentService';
import { UserProfile, ContentItem, UserPath } from './types';

// --- Mock Data ---
const CONTENT_ITEMS: ContentItem[] = [
  { id: '1', title: '爱儿美：给宝宝的第一份珍贵礼物', cover: 'https://picsum.photos/seed/baby1/400/600', type: 'image', category: 'parenting', author: '爱儿美管家', likes: 1240 },
  { id: '2', title: '产后28天黄金修复期，你应该知道这些', cover: 'https://picsum.photos/seed/recovery1/400/500', type: 'image', category: 'postpartum', author: '专业营养师', likes: 856 },
  { id: '3', title: '探店：爱儿美顶级行政套房全揭秘', cover: 'https://picsum.photos/seed/room1/400/700', type: 'video', category: 'pregnancy', author: '探店达人', likes: 3421 },
  { id: '4', title: '如何科学坐月子？避开这5个坑', cover: 'https://picsum.photos/seed/care1/400/550', type: 'image', category: 'postpartum', author: '资深护士长', likes: 2100 },
  { id: '5', title: '孕妈必看：产前准备清单', cover: 'https://picsum.photos/seed/prep1/400/650', type: 'image', category: 'pregnancy', author: '爱儿美顾问', likes: 1560 },
  { id: '6', title: '宝宝睡眠训练，从满月开始', cover: 'https://picsum.photos/seed/sleep1/400/600', type: 'image', category: 'parenting', author: '育儿专家', likes: 980 },
];

const SERVICE_CATEGORIES = [
  { id: 'recovery', title: '产后康复', icon: <Heart className="w-6 h-6" />, desc: '专业修复，重塑自信' },
  { id: 'newborn', title: '新生儿护理', icon: <Users className="w-6 h-6" />, desc: '24h护士，专业呵护' },
  { id: 'nutrition', title: '营养膳食', icon: <Utensils className="w-6 h-6" />, desc: '定制月子餐，科学调理' },
  { id: 'psychology', title: '心理疏导', icon: <MessageCircle className="w-6 h-6" />, desc: '身心同护，快乐月子' },
];

const SUITES = [
  { 
    id: 'elegant', 
    name: '雅致行政套房', 
    price: '¥68,800起', 
    size: '55㎡',
    features: ['朝南采光', '独立育婴室', '智能家居系统'],
    images: ['https://picsum.photos/seed/suite1/800/600', 'https://picsum.photos/seed/suite1b/800/600']
  },
  { 
    id: 'luxury', 
    name: '尊享至尊套房', 
    price: '¥128,800起', 
    size: '85㎡',
    features: ['全景落地窗', '私人管家服务', '顶级母婴护理设备'],
    images: ['https://picsum.photos/seed/suite2/800/600', 'https://picsum.photos/seed/suite2b/800/600']
  }
];

const PRESET_QUESTIONS = [
  { q: '产后脱发怎么办？', a: '产后脱发通常是由于激素水平变化引起的，属于生理性脱发。建议保持心情愉悦，保证充足睡眠，并补充优质蛋白质和铁质。通常在产后6-12个月会自行恢复。' },
  { q: '如何科学开奶？', a: '科学开奶的关键是“早接触、早吸吮、早开奶”。产后1小时内建议让宝宝吸吮。同时保持乳腺管通畅，避免过度进补油腻汤水，多喝温开水。' },
  { q: '新生儿黄疸如何观察？', a: '观察宝宝皮肤颜色，从面部开始，逐渐向下蔓延。若仅面部发黄为轻度；若躯干、四肢也发黄则需警惕。建议每日监测胆红素数值，遵医嘱进行光疗或多喂养。' },
];

// --- Components ---

const AuthModal = ({ isOpen, onClose, onAuthSuccess }: { isOpen: boolean, onClose: () => void, onAuthSuccess: () => void }) => {
  if (!isOpen) return null;
  return (
    <div className="absolute inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-6 rounded-[40px]">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl"
      >
        <div className="p-8 text-center">
          <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <Lock className="w-10 h-10 text-rose-400" />
          </div>
          <h3 className="text-2xl font-serif font-semibold text-gray-900 mb-2">尊贵体验 开启探索</h3>
          <p className="text-gray-500 text-sm mb-8 leading-relaxed">
            为了给您提供更专业的母婴顾问服务，请授权微信手机号登录。
          </p>
          <button 
            onClick={onAuthSuccess}
            className="w-full bg-rose-400 text-white py-4 rounded-full font-medium shadow-lg shadow-rose-200 hover:bg-rose-500 transition-colors mb-4"
          >
            微信一键授权登录
          </button>
          <button 
            onClick={onClose}
            className="text-gray-400 text-sm hover:text-gray-600"
          >
            暂不登录
          </button>
        </div>
      </motion.div>
    </div>
  );
};

const Navbar = () => {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  if (isAdmin) return null;

  return (
    <nav className="absolute bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-gray-100 px-6 py-3 pb-8 flex justify-around items-center z-40">
      <NavLink to="/" icon={<Home className="w-6 h-6" />} label="首页" active={location.pathname === '/'} />
      <NavLink to="/content" icon={<LayoutGrid className="w-6 h-6" />} label="内容" active={location.pathname === '/content'} />
      <NavLink to="/member" icon={<User className="w-6 h-6" />} label="我的" active={location.pathname === '/member'} />
    </nav>
  );
};

const NavLink = ({ to, icon, label, active }: { to: string, icon: React.ReactNode, label: string, active: boolean }) => (
  <Link to={to} className={cn("flex flex-col items-center gap-1 transition-all duration-300", active ? "text-rose-400 scale-110" : "text-gray-400 hover:text-gray-600")}>
    {icon}
    <span className="text-[10px] font-bold">{label}</span>
  </Link>
);

// --- Pages ---

const HomePage = ({ onAction }: { onAction: (path: string) => void }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = [
    { type: 'video', content: '品牌宣传视频 (自动播放/静音模拟)' },
    { type: 'image', content: '环境展示图 1 (高精装修)' },
    { type: 'image', content: '环境展示图 2 (母婴房)' },
    { type: 'image', content: '环境展示图 3 (公共区域)' },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <div className="pb-32">
      {/* Top Banner: Video + Images */}
      <section className="relative h-[65vh] w-full bg-gray-900 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0"
          >
            {slides[currentSlide].type === 'video' ? (
              <div className="absolute inset-0 flex items-center justify-center text-white border-b border-white/10 bg-black">
                <div className="absolute inset-0 opacity-40 bg-[url('https://picsum.photos/seed/video-bg/1920/1080')] bg-cover bg-center" />
                <div className="relative z-10 text-center">
                  <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center mx-auto mb-6 border border-white/30">
                    <Play className="w-10 h-10 text-white fill-white" />
                  </div>
                  <p className="text-base tracking-[0.2em] uppercase font-serif font-bold mb-2">爱儿美 · 品牌宣传</p>
                  <p className="text-[10px] text-white/60 tracking-widest uppercase">Professional Care & Love</p>
                </div>
                {/* Video Progress Bar Simulation */}
                <div className="absolute bottom-0 left-0 h-1 bg-rose-400 z-20 transition-all duration-[5000ms] ease-linear" style={{ width: '100%' }} key={currentSlide} />
              </div>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-800 text-white overflow-hidden">
                <img 
                  src={`https://picsum.photos/seed/env-${currentSlide}/1200/1600`} 
                  alt="Environment" 
                  className="absolute inset-0 w-full h-full object-cover opacity-60"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60" />
                <div className="relative z-10 text-center px-10">
                  <p className="text-xl font-serif font-bold tracking-wider mb-2">{slides[currentSlide].content}</p>
                  <div className="h-px w-12 bg-rose-400 mx-auto" />
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Indicators */}
        <div className="absolute bottom-8 left-8 right-8 flex gap-2 z-10">
          {slides.map((_, i) => (
            <div 
              key={i} 
              className={cn(
                "h-1 rounded-full transition-all duration-500", 
                i === currentSlide ? "w-8 bg-rose-400" : "w-2 bg-white/30"
              )} 
            />
          ))}
        </div>
      </section>

      {/* Store Intro */}
      <section className="px-8 py-10">
        <div className="mb-6">
          <h2 className="text-2xl font-serif font-bold text-gray-900 mb-2">爱儿美·尊享中心</h2>
          <p className="text-rose-400 text-sm font-medium mb-1">24小时专业护士值班 · 科学定制月子餐单</p>
          <p className="text-gray-400 text-[10px] uppercase tracking-widest">Premium Postpartum Care & Professional Nursing</p>
        </div>
        <p className="text-gray-500 text-sm leading-relaxed">
          爱儿美月子中心致力于为高净值家庭提供全方位、专业化的母婴护理服务。我们融合现代医学与传统月子文化，打造身心修复的静谧港湾。
        </p>
      </section>

      {/* 2x2 Nursing Categories */}
      <section className="py-8">
        <div className="px-8 mb-6">
          <h2 className="text-xl font-serif font-bold text-gray-900">护理分类</h2>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Professional Nursing Services</p>
        </div>
        <div className="grid grid-cols-2 gap-4 px-8">
          {SERVICE_CATEGORIES.map((cat) => (
            <div 
              key={cat.id}
              className="bg-white border border-gray-100 p-5 rounded-[32px] shadow-sm flex flex-col items-center text-center"
            >
              <div className="w-10 h-10 bg-gray-50 rounded-2xl flex items-center justify-center mb-3 text-rose-400 border border-gray-50">
                {cat.icon}
              </div>
              <h3 className="font-bold text-gray-900 text-xs mb-1">{cat.title}</h3>
              <p className="text-gray-400 text-[9px] leading-tight">{cat.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Action Buttons */}
      <section className="px-8 py-6 grid grid-cols-2 gap-4">
        <button 
          onClick={() => onAction('/suite-details')}
          className="bg-gray-900 text-white py-4 rounded-2xl text-sm font-bold shadow-xl shadow-gray-200"
        >
          查看套餐详情
        </button>
        <button 
          onClick={() => onAction('/booking')}
          className="bg-rose-400 text-white py-4 rounded-2xl text-sm font-bold shadow-xl shadow-rose-100"
        >
          预约看房
        </button>
      </section>
    </div>
  );
};

const ContentCenter = ({ onAction, profile }: { onAction: (path: string) => void, profile: UserProfile }) => {
  const [activeTab, setActiveTab] = useState('pregnancy');
  const [selectedQA, setSelectedQA] = useState<{q: string, a: string} | null>(null);
  const tabs = [
    { id: 'pregnancy', label: '孕期' },
    { id: 'postpartum', label: '月子' },
    { id: 'parenting', label: '育儿' },
  ];

  const getPregnancyStatus = () => {
    if (!profile.pregnancyInfo) return '未设置';
    const date = new Date(profile.pregnancyInfo.date);
    const now = new Date();
    const diffTime = Math.abs(date.getTime() - now.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (profile.pregnancyInfo.type === 'pregnancy') {
      const weeks = Math.floor((280 - diffDays) / 7);
      const days = (280 - diffDays) % 7;
      return `孕 ${weeks}周+${days}天`;
    } else {
      return `产后 ${diffDays}天`;
    }
  };

  return (
    <div className="pb-32 pt-10">
      <div className="px-8 mb-8">
        <h1 className="text-3xl font-serif font-bold text-gray-900 mb-6">内容中心</h1>
        
        {/* Daily Fortune / Reminder */}
        <section className="mb-8">
          <div className="bg-gradient-to-br from-rose-300 to-rose-500 rounded-[32px] p-6 text-white relative overflow-hidden shadow-lg shadow-rose-100">
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  <h3 className="text-sm font-bold">今日好运签 & 护理提醒</h3>
                </div>
                <div className="bg-white/20 px-3 py-1 rounded-full text-[10px] font-bold">{getPregnancyStatus()}</div>
              </div>
              <div className="bg-white/20 backdrop-blur-md p-5 rounded-2xl border border-white/20">
                <div className="flex gap-4 mb-3">
                  <div className="flex-1">
                    <p className="text-[10px] text-white/70 mb-1">宜</p>
                    <p className="text-xs font-bold">散步、听音乐</p>
                  </div>
                  <div className="w-px bg-white/20" />
                  <div className="flex-1">
                    <p className="text-[10px] text-white/70 mb-1">忌</p>
                    <p className="text-xs font-bold">过度劳累</p>
                  </div>
                </div>
                <div className="h-px bg-white/10 mb-3" />
                <div>
                  <p className="text-[10px] text-white/70 mb-1">护理要点</p>
                  <p className="text-[11px] leading-relaxed font-medium">
                    当前处于孕中期，建议每日补充钙质，并进行适量的凯格尔运动，为顺产做准备。
                  </p>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-white/10 rounded-full blur-2xl" />
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-rose-200/20 rounded-full blur-3xl" />
          </div>
        </section>

        {/* Compact AI Q&A Section */}
        <section className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-3 h-3 text-rose-400" />
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">专家建议 & 问答</span>
          </div>
          <div className="grid grid-cols-1 gap-2">
            {PRESET_QUESTIONS.map((item, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedQA(item)}
                className="flex items-center justify-between bg-white border border-gray-100 px-4 py-3 rounded-xl text-left hover:border-rose-200 transition-colors shadow-sm"
              >
                <span className="text-xs font-medium text-gray-600 truncate mr-4">{item.q}</span>
                <ArrowRight className="w-3 h-3 text-rose-300 flex-shrink-0" />
              </button>
            ))}
          </div>
        </section>

        <div className="flex gap-3 overflow-x-auto no-scrollbar mb-6">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "px-8 py-2.5 rounded-full text-xs font-bold transition-all whitespace-nowrap",
                activeTab === tab.id ? "bg-rose-400 text-white shadow-lg shadow-rose-100" : "bg-gray-100 text-gray-400"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* WeChat Style Article List */}
      <div className="px-6 space-y-4">
        {CONTENT_ITEMS.filter(post => post.category === activeTab).map((post, idx) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm"
          >
            <div className="aspect-[21/9] bg-gray-100 relative">
              <img 
                src={post.cover} 
                alt={post.title}
                className="w-full h-full object-cover opacity-80"
                referrerPolicy="no-referrer"
              />
              {post.type === 'video' && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-10 h-10 bg-black/30 backdrop-blur-md rounded-full flex items-center justify-center">
                    <Play className="w-5 h-5 text-white fill-current" />
                  </div>
                </div>
              )}
            </div>
            <div className="p-5">
              <h3 className="text-base font-bold text-gray-900 mb-3 leading-snug">
                {post.title}
              </h3>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 bg-rose-50 rounded-full flex items-center justify-center text-[8px] font-bold text-rose-400 border border-rose-100">
                    {post.author[0]}
                  </div>
                  <span className="text-[10px] text-gray-400 font-medium">{post.author}</span>
                </div>
                <div className="flex items-center gap-1 text-gray-300">
                  <Heart className="w-3 h-3" />
                  <span className="text-[10px] font-bold">{post.likes}</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* QA Popup */}
      <AnimatePresence>
        {selectedQA && (
          <div className="absolute inset-0 z-[110] flex items-end justify-center px-4 pb-10">
            <motion.div 
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100 }}
              className="bg-white w-full max-w-sm rounded-[40px] shadow-2xl border border-gray-100 overflow-hidden"
            >
              <div className="p-8">
                <div className="flex justify-between items-start mb-6">
                  <div className="bg-rose-50 text-rose-500 px-4 py-1 rounded-full text-[10px] font-bold">专家审核回答</div>
                  <button onClick={() => setSelectedQA(null)} className="text-gray-300 hover:text-gray-500">
                    <X className="w-6 h-6" />
                  </button>
                </div>
                <h3 className="text-xl font-serif font-bold text-gray-900 mb-4">{selectedQA.q}</h3>
                <div className="bg-gray-50 p-6 rounded-3xl">
                  <p className="text-sm text-gray-600 leading-relaxed">{selectedQA.a}</p>
                </div>
                <button 
                  onClick={() => setSelectedQA(null)}
                  className="w-full mt-8 bg-gray-900 text-white py-4 rounded-full font-bold text-sm"
                >
                  我知道了
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const MemberCenter = ({ onAction }: { onAction: (path: string) => void }) => {
  const [activeModal, setActiveModal] = useState<string | null>(null);

  return (
    <div className="pb-32">
      {/* Profile Header */}
      <section className="bg-gray-900 pt-16 pb-12 px-8 rounded-b-[60px]">
        <div className="flex items-center gap-6 mb-8">
          <div className="w-20 h-20 rounded-full border-2 border-rose-400 p-1 bg-gray-800 flex items-center justify-center text-gray-600 font-bold text-xs">
            头像线框
          </div>
          <div>
            <div className="h-6 bg-white/20 rounded-full w-24 mb-2" />
            <div className="bg-rose-400/20 text-rose-400 text-[10px] font-bold px-3 py-1 rounded-full border border-rose-400/30 inline-block">
              GOLD MEMBER
            </div>
          </div>
        </div>
        
        {/* Stats Card */}
        <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 flex justify-around border border-white/10">
          {[1, 2, 3].map((_, i) => (
            <React.Fragment key={i}>
              <div className="text-center">
                <div className="h-2 bg-white/20 rounded-full w-8 mb-2 mx-auto" />
                <div className="h-4 bg-white/40 rounded-full w-12 mx-auto" />
              </div>
              {i < 2 && <div className="w-px h-8 bg-white/10 self-center" />}
            </React.Fragment>
          ))}
        </div>
      </section>

      {/* Service Grid */}
      <section className="px-8 -mt-8">
        <div className="bg-white rounded-[40px] shadow-xl p-8 grid grid-cols-2 gap-8">
          {[
            { id: 'reminders', icon: <Calendar className="w-7 h-7" />, label: '产检提醒', color: 'rose' },
            { id: 'meals', icon: <Utensils className="w-7 h-7" />, label: '月子餐单', color: 'blue' },
            { id: 'mall', icon: <ShoppingBag className="w-7 h-7" />, label: '积分商城', color: 'purple' },
            { id: 'butler', icon: <Headset className="w-7 h-7" />, label: '一键管家', color: 'green' },
          ].map((item) => (
            <button key={item.id} onClick={() => setActiveModal(item.id)} className="flex flex-col items-center gap-3">
              <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center", `bg-${item.color}-50 text-${item.color}-400`)}>
                {item.icon}
              </div>
              <span className="text-sm font-medium text-gray-700">{item.label}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Daily Fortune */}
      <section className="px-8 py-12">
        <div className="bg-gradient-to-br from-rose-300 to-rose-500 rounded-[40px] p-8 text-white relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="text-lg font-serif font-bold mb-2">每日提醒线框</h3>
            <div className="h-3 bg-white/20 rounded-full w-1/2 mb-6" />
            <div className="bg-white/20 backdrop-blur-md p-6 rounded-3xl border border-white/20">
              <div className="h-3 bg-white/40 rounded-full w-full mb-2" />
              <div className="h-3 bg-white/40 rounded-full w-4/5" />
            </div>
          </div>
          <Sparkles className="absolute -bottom-4 -right-4 w-32 h-32 text-white/10 rotate-12" />
        </div>
      </section>

      {/* Modals for Member Features */}
      <AnimatePresence>
        {activeModal && (
          <div className="absolute inset-0 z-[120] flex items-center justify-center p-6">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setActiveModal(null)} />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white w-full max-w-sm rounded-[40px] shadow-2xl relative z-10 overflow-hidden"
            >
              <div className="p-8">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-serif font-bold text-gray-900">
                    {activeModal === 'reminders' && '产检提醒'}
                    {activeModal === 'meals' && '月子餐单'}
                    {activeModal === 'mall' && '积分商城'}
                    {activeModal === 'butler' && '专属管家'}
                  </h3>
                  <button onClick={() => setActiveModal(null)} className="text-gray-300 hover:text-gray-500">
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {activeModal === 'reminders' && (
                  <div className="space-y-6">
                    <div className="bg-rose-50 p-4 rounded-3xl text-center">
                      <p className="text-[10px] text-rose-400 font-bold uppercase mb-1">距离下次产检</p>
                      <p className="text-3xl font-serif font-bold text-rose-500">5天</p>
                    </div>
                    <div className="border border-gray-100 rounded-3xl p-4">
                      <p className="text-xs font-bold text-gray-400 mb-4 text-center">2026年3月</p>
                      <div className="grid grid-cols-7 gap-2 text-center text-[10px] font-bold text-gray-300">
                        {['日','一','二','三','四','五','六'].map(d => <div key={d}>{d}</div>)}
                        {Array.from({length: 31}).map((_, i) => (
                          <div key={i} className={cn("p-1 rounded-full", i+1 === 28 ? "bg-rose-400 text-white" : "")}>
                            {i+1}
                          </div>
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 text-center">项目：大排畸超声检查</p>
                  </div>
                )}

                {activeModal === 'meals' && (
                  <div className="space-y-4 max-h-[400px] overflow-y-auto no-scrollbar pb-4">
                    <div className="bg-blue-50 p-5 rounded-3xl mb-2">
                      <p className="text-[10px] text-blue-400 font-bold uppercase mb-1">营养师推荐</p>
                      <h4 className="font-bold text-blue-600 text-sm">爱儿美·科学月子餐单</h4>
                      <p className="text-[9px] text-gray-400 mt-1">根据产后修复阶段，定制每日均衡营养</p>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-3">
                      {[
                        { name: '清蒸鲈鱼 + 五红汤', desc: '补血养气，优质蛋白', stage: '第一阶段：排恶露' },
                        { name: '花生猪蹄汤 + 炒时蔬', desc: '通乳催乳，胶原蛋白', stage: '第二阶段：调理' },
                        { name: '虫草花炖鸡 + 杂粮饭', desc: '深度滋补，增强免疫', stage: '第三阶段：进补' },
                        { name: '燕窝银耳羹 + 鲜果盘', desc: '美容养颜，清润滋养', stage: '第四阶段：修身' },
                        { name: '鲍鱼捞饭 + 菌菇汤', desc: '高端食材，全面营养', stage: '全阶段适用' },
                      ].map((meal, i) => (
                        <div key={i} className="bg-white border border-gray-100 p-4 rounded-2xl shadow-sm">
                          <div className="flex justify-between items-start mb-1">
                            <h5 className="text-xs font-bold text-gray-800">{meal.name}</h5>
                            <span className="text-[8px] bg-gray-50 text-gray-400 px-2 py-0.5 rounded-full">{meal.stage}</span>
                          </div>
                          <p className="text-[10px] text-gray-400">{meal.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeModal === 'mall' && (
                  <div className="space-y-6">
                    <div className="flex justify-between items-center bg-purple-50 p-4 rounded-3xl">
                      <div>
                        <p className="text-[10px] text-purple-400 font-bold">当前积分</p>
                        <p className="text-xl font-bold text-purple-600">2,480</p>
                      </div>
                      <button 
                        onClick={(e) => {
                          const btn = e.currentTarget;
                          btn.innerText = '已签到';
                          btn.disabled = true;
                          btn.className = "bg-gray-200 text-gray-400 px-4 py-2 rounded-full text-[10px] font-bold";
                        }}
                        className="bg-purple-500 text-white px-4 py-2 rounded-full text-[10px] font-bold active:scale-95 transition-transform"
                      >
                        每日签到
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="border border-gray-100 p-3 rounded-2xl text-center group">
                        <div className="w-full aspect-square bg-gray-50 rounded-xl mb-2 flex items-center justify-center text-[10px] text-gray-300 relative overflow-hidden">
                          <img src="https://picsum.photos/seed/gift1/200/200" className="absolute inset-0 w-full h-full object-cover opacity-40" referrerPolicy="no-referrer" />
                          <span className="relative z-10">礼品线框</span>
                        </div>
                        <p className="text-[10px] font-bold text-gray-700">婴儿护肤套装</p>
                        <p className="text-[9px] text-purple-400 mb-2">500 积分</p>
                        <button className="w-full bg-purple-50 text-purple-500 py-1.5 rounded-lg text-[9px] font-bold">立即兑换</button>
                      </div>
                      <div className="border border-gray-100 p-3 rounded-2xl text-center group">
                        <div className="w-full aspect-square bg-gray-50 rounded-xl mb-2 flex items-center justify-center text-[10px] text-gray-300 relative overflow-hidden">
                          <img src="https://picsum.photos/seed/gift2/200/200" className="absolute inset-0 w-full h-full object-cover opacity-40" referrerPolicy="no-referrer" />
                          <span className="relative z-10">礼品线框</span>
                        </div>
                        <p className="text-[10px] font-bold text-gray-700">产后瑜伽课</p>
                        <p className="text-[9px] text-purple-400 mb-2">1200 积分</p>
                        <button className="w-full bg-purple-50 text-purple-500 py-1.5 rounded-lg text-[9px] font-bold">立即兑换</button>
                      </div>
                    </div>
                  </div>
                )}

                {activeModal === 'butler' && (
                  <div className="text-center space-y-6">
                    <div className="w-48 h-48 bg-white mx-auto rounded-3xl border border-gray-100 shadow-inner flex flex-col items-center justify-center p-6 relative">
                      <div className="absolute inset-0 bg-[url('https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=AiErMeiButler')] bg-contain bg-center opacity-10 m-6" />
                      <div className="w-full h-full border-2 border-dashed border-gray-100 rounded-xl flex items-center justify-center relative z-10">
                        <img 
                          src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=AiErMeiButler" 
                          alt="QR Code" 
                          className="w-32 h-32"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-bold text-gray-900">专属管家 · 晓雅</p>
                      <p className="text-xs text-gray-500 leading-relaxed px-4">
                        您的专属管家 24 小时在线<br/>为您协调一切院内服务与专家咨询
                      </p>
                    </div>
                    <button className="w-full bg-green-500 text-white py-4 rounded-full font-bold text-sm shadow-lg shadow-green-100">保存二维码到相册</button>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};


const SuiteDetails = ({ onBack }: { onBack: () => void }) => {
  const [selectedSuite, setSelectedSuite] = useState<typeof SUITES[0] | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  return (
    <div className="pb-32 pt-10 px-8">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={onBack} className="text-gray-400 hover:text-gray-600">
          <ChevronRight className="w-6 h-6 rotate-180" />
        </button>
        <h1 className="text-2xl font-serif font-bold text-gray-900">房型套餐</h1>
      </div>

      <div className="space-y-6">
        {SUITES.map((suite) => (
          <motion.div
            key={suite.id}
            whileTap={{ scale: 0.98 }}
            onClick={() => setSelectedSuite(suite)}
            className="bg-white rounded-[32px] overflow-hidden border border-gray-100 shadow-sm"
          >
            <div className="aspect-video bg-gray-100 flex items-center justify-center text-[10px] text-gray-300 font-bold uppercase relative">
              <img 
                src={suite.images[0]} 
                alt={suite.name} 
                className="absolute inset-0 w-full h-full object-cover opacity-80"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-black/10" />
              <span className="relative z-10 text-white drop-shadow-md">房型封面图线框</span>
            </div>
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{suite.name}</h3>
                  <p className="text-xs text-gray-400">{suite.size} · {suite.features.join(' | ')}</p>
                </div>
                <span className="text-rose-500 font-bold">{suite.price}</span>
              </div>
              <button className="w-full bg-rose-50 text-rose-500 py-3 rounded-2xl text-xs font-bold">查看详情</button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Suite Detail Overlay */}
      <AnimatePresence>
        {selectedSuite && (
          <motion.div 
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="absolute inset-0 z-[130] bg-white overflow-y-auto no-scrollbar rounded-[40px]"
          >
            <div className="relative h-[45vh] bg-gray-900 group">
              <button 
                onClick={() => setSelectedSuite(null)}
                className="absolute top-12 left-8 z-20 bg-white/20 backdrop-blur-md text-white p-2 rounded-full"
              >
                <ChevronRight className="w-6 h-6 rotate-180" />
              </button>
              
              {/* Image Carousel */}
              <div className="w-full h-full relative overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={currentImageIndex}
                    src={selectedSuite.images[currentImageIndex]}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="absolute inset-0 w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </AnimatePresence>
                
                {/* Carousel Controls */}
                <div className="absolute inset-0 flex items-center justify-between px-4 z-10">
                  <button 
                    onClick={() => setCurrentImageIndex(prev => (prev - 1 + selectedSuite.images.length) % selectedSuite.images.length)}
                    className="p-2 bg-black/20 backdrop-blur-sm rounded-full text-white/50 hover:text-white"
                  >
                    <ChevronRight className="w-5 h-5 rotate-180" />
                  </button>
                  <button 
                    onClick={() => setCurrentImageIndex(prev => (prev + 1) % selectedSuite.images.length)}
                    className="p-2 bg-black/20 backdrop-blur-sm rounded-full text-white/50 hover:text-white"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>

                {/* Carousel Indicators */}
                <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                  {selectedSuite.images.map((_, i) => (
                    <div 
                      key={i} 
                      className={cn(
                        "h-1 rounded-full transition-all duration-300",
                        i === currentImageIndex ? "w-6 bg-rose-400" : "w-1.5 bg-white/40"
                      )}
                    />
                  ))}
                </div>

                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
              </div>
            </div>

            <div className="p-8 -mt-10 bg-white rounded-t-[40px] relative z-10">
              <div className="flex justify-between items-end mb-8">
                <div>
                  <h2 className="text-2xl font-serif font-bold text-gray-900 mb-2">{selectedSuite.name}</h2>
                  <div className="flex gap-2">
                    {selectedSuite.features.map(f => (
                      <span key={f} className="bg-gray-50 text-gray-400 text-[9px] px-3 py-1 rounded-full">{f}</span>
                    ))}
                  </div>
                </div>
                <p className="text-rose-500 text-xl font-bold">{selectedSuite.price}</p>
              </div>

              <div className="space-y-8">
                <section>
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">房型介绍</h4>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    该房型由国际知名设计师团队打造，融合了现代极简主义与母婴人体工程学。全屋配备智能恒温恒湿系统，独立育婴区与休息区分离，确保产妇与新生儿的私密与安静。
                  </p>
                </section>

                <section>
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">配套设施</h4>
                  <div className="grid grid-cols-2 gap-4">
                    {['24h呼叫系统','智能马桶','空气净化器','专业护理床'].map(i => (
                      <div key={i} className="flex items-center gap-2 text-xs text-gray-500">
                        <div className="w-1.5 h-1.5 bg-rose-400 rounded-full" />
                        {i}
                      </div>
                    ))}
                  </div>
                </section>

                <button className="w-full bg-rose-400 text-white py-5 rounded-full font-bold shadow-xl shadow-rose-100">立即预约看房</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const AdminDashboard = ({ profile }: { profile: UserProfile }) => {
  const [analysis, setAnalysis] = useState<{ tags: string[], script: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    setLoading(true);
    const result = await analyzeUserBehavior(profile);
    setAnalysis(result);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <header className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-3xl font-serif font-bold text-gray-900">智能管理后台</h1>
            <p className="text-gray-500">爱儿美 Agent 客户路径追踪与分析</p>
          </div>
          <div className="flex gap-4">
            <div className="bg-white px-6 py-3 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-3">
              <Users className="w-5 h-5 text-rose-400" />
              <span className="text-sm font-semibold">活跃客户: 124</span>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-3 gap-8 mb-12">
          <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100">
            <BarChart3 className="w-8 h-8 text-blue-400 mb-4" />
            <p className="text-gray-400 text-xs uppercase mb-1">平均停留时长</p>
            <p className="text-2xl font-bold text-gray-900">12.5 min</p>
          </div>
          <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100">
            <TrendingUp className="w-8 h-8 text-green-400 mb-4" />
            <p className="text-gray-400 text-xs uppercase mb-1">新留资比</p>
            <p className="text-2xl font-bold text-gray-900">42%</p>
          </div>
          <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100">
            <Sparkles className="w-8 h-8 text-rose-400 mb-4" />
            <p className="text-gray-400 text-xs uppercase mb-1">热门内容榜单</p>
            <p className="text-2xl font-bold text-gray-900">行政套房揭秘</p>
          </div>
        </div>

        <div className="bg-white rounded-[40px] shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-8 border-b border-gray-50 flex justify-between items-center">
            <h2 className="text-xl font-serif font-bold">当前客户画像分析</h2>
            <button 
              onClick={handleAnalyze}
              disabled={loading}
              className="bg-gray-900 text-white px-6 py-3 rounded-full text-sm font-medium flex items-center gap-2 disabled:opacity-50"
            >
              {loading ? "分析中..." : "重新分析路径"} <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          
          <div className="p-8">
            <div className="mb-8">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">浏览路径追踪</h3>
              <div className="flex flex-wrap gap-3">
                {profile.paths.map((p, i) => (
                  <React.Fragment key={i}>
                    <div className="bg-gray-50 px-4 py-2 rounded-xl text-sm text-gray-600 border border-gray-100">
                      {p.path}
                    </div>
                    {i < profile.paths.length - 1 && <ChevronRight className="w-4 h-4 self-center text-gray-300" />}
                  </React.Fragment>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8">
              <div>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">智能标签 (Agent)</h3>
                <div className="flex flex-wrap gap-2">
                  {(analysis?.tags || profile.tags).map((tag, i) => (
                    <span key={i} className="bg-rose-50 text-rose-500 px-4 py-1.5 rounded-full text-xs font-bold border border-rose-100">
                      #{tag}
                    </span>
                  ))}
                  {(!analysis && profile.tags.length === 0) && <span className="text-gray-400 text-sm italic">暂无标签</span>}
                </div>
              </div>
              <div>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">销售建议话术</h3>
                <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100">
                  <p className="text-sm text-gray-600 leading-relaxed italic">
                    {analysis?.script || "点击上方按钮生成针对性话术建议。"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [pendingPath, setPendingPath] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile>({
    uid: 'user_123',
    paths: [{ path: '首页', timestamp: Date.now() }],
    tags: [],
    lastActive: Date.now(),
    pregnancyInfo: {
      type: 'pregnancy',
      date: '2026-08-15'
    }
  });

  const trackAction = (path: string) => {
    // Lead capture logic: check login for specific paths
    const protectedPaths = ['/suite-details', '/booking', '/reminders', '/meals', '/mall', '/butler'];
    if (protectedPaths.includes(path) && !isLoggedIn) {
      setPendingPath(path);
      setShowAuth(true);
      return;
    }

    setUserProfile(prev => ({
      ...prev,
      paths: [...prev.paths, { path, timestamp: Date.now() }],
      lastActive: Date.now()
    }));

    if (path.startsWith('/')) {
      navigate(path);
    }
  };

  const handleAuthSuccess = () => {
    setIsLoggedIn(true);
    setShowAuth(false);
    trackAction('登录成功');
    if (pendingPath) {
      navigate(pendingPath);
      setPendingPath(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center p-4 md:p-8 font-sans text-gray-900 selection:bg-rose-100">
      
      {/* iPhone 16 Frame Wrapper */}
      <div className="relative w-full max-w-[393px] aspect-[393/852] bg-black rounded-[55px] shadow-[0_0_0_12px_#1a1a1a,0_30px_60px_-15px_rgba(0,0,0,0.3)] overflow-hidden border-[8px] border-[#1a1a1a]">
        
        {/* Dynamic Island */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-7 bg-black rounded-full z-50 flex items-center justify-center">
          <div className="w-2 h-2 bg-[#1a1a1a] rounded-full absolute right-4" />
        </div>

        {/* Screen Content */}
        <div className="relative w-full h-full bg-white rounded-[40px] overflow-hidden">
          {/* Scrollable Content Area */}
          <div className="w-full h-full overflow-y-auto no-scrollbar pb-24">
            <Routes>
              <Route path="/" element={<HomePage onAction={trackAction} />} />
              <Route path="/content" element={<ContentCenter onAction={trackAction} profile={userProfile} />} />
              <Route path="/member" element={<MemberCenter onAction={trackAction} />} />
              <Route path="/suite-details" element={<SuiteDetails onBack={() => navigate(-1)} />} />
              <Route path="/admin" element={<AdminDashboard profile={userProfile} />} />
            </Routes>
          </div>
          
          <Navbar />

          <AuthModal 
            isOpen={showAuth} 
            onClose={() => setShowAuth(false)} 
            onAuthSuccess={handleAuthSuccess} 
          />
        </div>

        {/* Home Indicator */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 bg-black/20 rounded-full z-50" />
      </div>

      {/* Admin Link (External to phone for easy access in prototype) */}
      <Link 
        to="/admin" 
        className="fixed top-6 right-6 bg-white shadow-lg p-4 rounded-2xl border border-gray-100 text-gray-400 hover:text-rose-400 transition-all z-50 flex items-center gap-2 group"
        title="管理后台"
      >
        <BarChart3 className="w-6 h-6" />
        <span className="text-sm font-bold text-gray-900 opacity-0 group-hover:opacity-100 transition-opacity">智能后台</span>
      </Link>
    </div>
  );
}
