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
  ArrowRight,
  Star,
  MessageSquare,
  Package,
  Ticket,
  Phone,
  ShieldCheck,
  QrCode,
  Check
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
  { id: '7', title: '金牌月嫂的一天：专业与温情的守护', cover: 'https://picsum.photos/seed/nanny1/400/600', type: 'image', category: 'nanny', author: '月嫂主管', likes: 1890 },
  { id: '8', title: '如何挑选适合自己的月嫂？', cover: 'https://picsum.photos/seed/nanny2/400/500', type: 'image', category: 'nanny', author: '母婴顾问', likes: 1245 },
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
    <div className="absolute inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-6 rounded-[40px]">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white border border-gray-900/10 w-full max-w-sm overflow-hidden shadow-2xl"
      >
        <div className="p-10 text-center">
          <div className="w-16 h-16 bg-gray-50 border border-gray-900/5 flex items-center justify-center mx-auto mb-8">
            <Lock className="w-8 h-8 text-gray-900" />
          </div>
          <h3 className="text-sm font-serif font-light text-gray-900 mb-4 tracking-[0.2em] uppercase">尊贵体验 开启探索</h3>
          <p className="text-gray-400 text-[10px] mb-10 leading-relaxed tracking-widest uppercase">
            为了给您提供更专业的母婴顾问服务，请授权微信手机号登录。
          </p>
          <button 
            onClick={onAuthSuccess}
            className="w-full bg-gray-900 text-white py-4 text-[11px] font-light tracking-[0.2em] uppercase shadow-lg shadow-gray-900/10 hover:bg-gray-800 transition-colors mb-4"
          >
            微信一键授权登录
          </button>
          <button 
            onClick={onClose}
            className="text-[10px] text-gray-400 hover:text-gray-900 transition-colors tracking-widest uppercase"
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
    <nav className="absolute bottom-0 left-0 right-0 bg-white/10 backdrop-blur-xl border-t border-white/20 px-2 py-3 pb-8 flex justify-around items-center z-50">
      <NavLink to="/" icon={<Home className="w-5 h-5" />} label="首页" active={location.pathname === '/'} />
      <NavLink to="/center" icon={<LayoutGrid className="w-5 h-5" />} label="月子中心" active={location.pathname === '/center'} />
      <NavLink to="/content" icon={<MessageCircle className="w-5 h-5" />} label="内容" active={location.pathname === '/content'} />
      <NavLink to="/member" icon={<User className="w-5 h-5" />} label="我的" active={location.pathname === '/member'} />
    </nav>
  );
};

const NavLink = ({ to, icon, label, active }: { to: string, icon: React.ReactNode, label: string, active: boolean }) => (
  <Link to={to} className={cn("flex flex-col items-center gap-1.5 transition-all duration-500", active ? "text-gray-900 scale-105" : "text-gray-400 hover:text-gray-600")}>
    {icon}
    <span className="text-[9px] font-light tracking-[0.2em] uppercase">{label}</span>
  </Link>
);

// --- Pages ---

const HomePage = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const posters = [
    { 
      id: '1', 
      title: '爱儿美：给宝宝的第一份珍贵礼物', 
      buttonText: '品牌故事', 
      image: 'https://picsum.photos/seed/poster1/1080/1920',
      detailTitle: '爱儿美品牌故事',
      detailContent: '爱儿美（Ai Er Mei）作为母婴护理行业的领军品牌，致力于为每一位母亲提供最专业的呵护...'
    },
    { 
      id: '2', 
      title: '专业护理 匠心守护 享耀新生', 
      buttonText: '护理体系', 
      image: 'https://picsum.photos/seed/poster2/1080/1920',
      detailTitle: '专业护理体系',
      detailContent: '我们拥有完善的护理体系，从产后修复到新生儿护理，每一个环节都精益求精...'
    },
    { 
      id: '3', 
      title: '奢华环境 极致体验 舒适月子', 
      buttonText: '环境展示', 
      image: 'https://picsum.photos/seed/poster3/1080/1920',
      detailTitle: '中心环境展示',
      detailContent: '坐落于城市核心地段，提供五星级酒店般的居住体验，让您的月子生活充满仪式感...'
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % posters.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [posters.length]);

  const handleDragEnd = (event: any, info: any) => {
    const threshold = 50;
    if (info.offset.x < -threshold) {
      setCurrentSlide((prev) => (prev + 1) % posters.length);
    } else if (info.offset.x > threshold) {
      setCurrentSlide((prev) => (prev - 1 + posters.length) % posters.length);
    }
  };

  return (
    <div className="h-full w-full overflow-hidden relative bg-[#F5F5F0]">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          onDragEnd={handleDragEnd}
          className="absolute inset-0 cursor-grab active:cursor-grabbing"
        >
          <img 
            src={posters[currentSlide].image} 
            alt={posters[currentSlide].title}
            className="w-full h-full object-cover opacity-60 pointer-events-none"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40 pointer-events-none" />
          
          <div className="absolute inset-0 flex flex-col items-center justify-center px-12 text-center pointer-events-none">
            <motion.h1 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-2xl font-serif font-light text-white mb-16 tracking-[0.3em] leading-relaxed max-w-[280px] mx-auto uppercase"
            >
              {posters[currentSlide].title}
            </motion.h1>
            
            <motion.button
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/poster/${posters[currentSlide].id}`);
              }}
              className="bg-transparent text-white border border-white/20 backdrop-blur-md px-16 py-4 text-[10px] font-light tracking-[0.5em] hover:bg-white/10 transition-all duration-500 uppercase pointer-events-auto"
            >
              {posters[currentSlide].buttonText}
            </motion.button>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Indicators */}
      <div className="absolute bottom-32 left-1/2 -translate-x-1/2 flex gap-4 z-10">
        {posters.map((_, i) => (
          <button 
            key={i}
            onClick={() => setCurrentSlide(i)}
            className={cn(
              "h-[1px] transition-all duration-700", 
              i === currentSlide ? "w-12 bg-white" : "w-4 bg-white/20"
            )} 
          />
        ))}
      </div>

      {/* Logo Overlay */}
      <div className="absolute top-12 left-8 z-20">
        <h2 className="text-white font-serif text-xl tracking-[0.3em] font-bold">AI ER MEI</h2>
        <p className="text-white/40 text-[7px] tracking-[0.4em] uppercase">爱儿美母婴护理中心</p>
      </div>
    </div>
  );
};

const PosterDetailPage = () => {
  const id = useLocation().pathname.split('/').slice(-1)[0];
  const navigate = useNavigate();
  const [showQR, setShowQR] = useState(false);
  
  const detail = {
    title: '探索月子之旅',
    content: '这里是海报点击进入后的详细内容展示。内容包括品牌故事、专业护理体系、环境展示等。用户可以在B端自行上传图片和文字内容。',
    image: 'https://picsum.photos/seed/detail/800/1200'
  };

  return (
    <div className="min-h-full bg-[#F5F5F0] pb-40 relative">
      <div className="w-full aspect-[3/4] bg-gray-200 relative">
        <img src={detail.image} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
        <div className="absolute top-12 left-8">
           <button onClick={() => navigate(-1)} className="bg-white/20 backdrop-blur-md p-2 text-white">
             <ChevronRight className="w-6 h-6 rotate-180" />
           </button>
        </div>
      </div>
      
      <div className="p-8">
        <h1 className="text-2xl font-serif font-light text-gray-900 mb-8 tracking-[0.2em] uppercase">{detail.title}</h1>
        <p className="text-gray-600 leading-relaxed text-xs font-light tracking-widest mb-8">
          {detail.content}
        </p>
      </div>

      <div className="absolute bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-gray-900/5 p-8 z-50">
        <div className="flex gap-4 mb-6">
          <button 
            onClick={() => navigate('/center')}
            className="flex-1 border border-gray-900/10 py-4 text-[10px] font-light tracking-[0.3em] text-gray-600 uppercase"
          >
            返回内容中心
          </button>
          <button 
            onClick={() => setShowQR(true)}
            className="flex-1 bg-gray-900 text-white py-4 text-[10px] font-light tracking-[0.3em] uppercase"
          >
            立即预约
          </button>
        </div>
        <div className="flex items-center justify-center gap-2 text-gray-400 text-[9px] font-light tracking-widest uppercase">
          <Play className="w-3 h-3 rotate-90" />
          <span className="underline underline-offset-4">关注微信公众号，获取最新内容</span>
        </div>
      </div>

      {/* QR Code Modal */}
      <AnimatePresence>
        {showQR && (
          <div className="absolute inset-0 z-[200] flex items-center justify-center p-8">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowQR(false)} />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white p-12 border border-gray-900/5 relative z-10 text-center"
            >
              <button onClick={() => setShowQR(false)} className="absolute top-4 right-4 text-gray-300">
                <X className="w-5 h-5" />
              </button>
              <div className="w-48 h-48 bg-gray-50 border border-gray-900/5 flex items-center justify-center mb-8">
                <QrCode className="w-32 h-32 text-gray-900/20" />
              </div>
              <h3 className="text-sm font-serif font-light text-gray-900 tracking-[0.2em] mb-2 uppercase">扫码预约</h3>
              <p className="text-[10px] text-gray-400 font-light tracking-widest uppercase">添加专属顾问，开启尊享服务</p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const ConfinementCenterPage = ({ onBack }: { onBack: () => void }) => {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const [dragConstraints, setDragConstraints] = useState({ left: 0, right: 0 });
  
  const sections = [
    { id: 'env', title: '爱儿美·环境', image: 'https://picsum.photos/seed/env_high/800/1200', desc: '奢华私密空间，极致舒适体验' },
    { id: 'equip', title: '爱儿美·器械', image: 'https://picsum.photos/seed/equip_high/800/1200', desc: '顶尖母婴设备，科学专业护理' },
    { id: 'meal', title: '爱儿美·月子餐', image: 'https://picsum.photos/seed/meal_high/800/1200', desc: '五星大厨定制，营养均衡调理' },
    { id: 'team', title: '爱儿美·团队', image: 'https://picsum.photos/seed/team_high/800/1200', desc: '资深专家坐镇，全天候贴心守护' },
  ];

  useEffect(() => {
    if (containerRef.current) {
      const scrollWidth = containerRef.current.scrollWidth;
      const offsetWidth = containerRef.current.offsetWidth;
      setDragConstraints({ left: -(scrollWidth - offsetWidth), right: 0 });
    }
  }, []);

  return (
    <div className="min-h-full bg-[#F5F5F0] pb-32 relative">
      {/* 3/4 Hero Image */}
      <div className="relative h-[75vh] w-full overflow-hidden">
        <img 
          src="https://picsum.photos/seed/storefront/1080/1920" 
          className="w-full h-full object-cover brightness-75"
          alt="爱儿美店面"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />
        
        {/* Back Button */}
        <button 
          onClick={onBack} 
          className="absolute top-12 left-6 z-50 text-white/80 hover:text-white transition-colors"
        >
          <ChevronRight className="w-8 h-8 rotate-180" />
        </button>

        {/* Branding Overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl font-serif font-light text-white tracking-[0.3em] mb-4">
              AI ER MEI
            </h1>
            <h2 className="text-3xl font-serif font-light text-white/90 tracking-[0.2em]">
              RESIDENCES
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="absolute bottom-24 flex flex-col items-center"
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              <ArrowRight className="w-6 h-6 rotate-90 text-white/40" />
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Horizontal Sliding Sections */}
      <div className="relative -mt-24 z-10 overflow-hidden">
        <motion.div 
          ref={containerRef}
          drag="x"
          dragConstraints={dragConstraints}
          dragElastic={0.2}
          dragTransition={{ power: 0.2, timeConstant: 200 }}
          className="flex gap-6 px-8 cursor-grab active:cursor-grabbing pb-12"
        >
          {sections.map((section, idx) => (
            <motion.div
              key={section.id}
              className="flex-shrink-0 w-[280px] cursor-pointer group select-none"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.8 }}
              onClick={() => navigate(`/center/${section.id}`)}
              whileTap={{ scale: 0.98 }}
            >
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-1.5 shadow-2xl pointer-events-none">
                <div className="aspect-[3/4.8] overflow-hidden relative">
                  <img 
                    src={section.image} 
                    className="w-full h-full object-cover opacity-90 group-hover:scale-110 transition-transform duration-[2000ms] ease-out"
                    alt={section.title}
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-8">
                    <motion.h4 
                      initial={{ y: 20, opacity: 0 }}
                      whileInView={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.2 + idx * 0.1 }}
                      className="text-white font-serif text-xl tracking-[0.2em] mb-3"
                    >
                      {section.title}
                    </motion.h4>
                    <motion.p 
                      initial={{ y: 20, opacity: 0 }}
                      whileInView={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.4 + idx * 0.1 }}
                      className="text-white/60 text-[10px] tracking-[0.1em] font-light leading-relaxed line-clamp-2"
                    >
                      {section.desc}
                    </motion.p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
        
        {/* Scroll Hint */}
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
          {sections.map((_, i) => (
            <div key={i} className="w-1 h-1 rounded-full bg-gray-900/20" />
          ))}
        </div>
      </div>

      {/* Facilities & Packages */}
      <div className="px-8 space-y-16">
        <section>
          <div className="flex items-center gap-4 mb-8">
            <div className="h-px flex-1 bg-gray-900/10" />
            <h2 className="text-[10px] text-gray-400 font-light uppercase tracking-[0.3em]">了解更多</h2>
            <div className="h-px flex-1 bg-gray-900/10" />
          </div>
          <div className="space-y-12">
            {[
              { title: '智能恒温育婴室', desc: '全天候恒温恒湿，配备专业育婴师及24小时监控系统。', image: 'https://picsum.photos/seed/fac1_high/800/500' },
              { title: '产后修复中心', desc: '引进国际顶级修复设备，提供骨盆修复、腹直肌修复等专业服务。', image: 'https://picsum.photos/seed/fac2_high/800/500' },
            ].map((f, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="group"
              >
                <div className="aspect-[16/9] overflow-hidden mb-6 bg-gray-200">
                  <img src={f.image} className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-1000" />
                </div>
                <h3 className="text-sm font-serif font-light text-gray-900 mb-2 tracking-widest">{f.title}</h3>
                <p className="text-[11px] text-gray-400 leading-relaxed tracking-widest font-light">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="pb-16">
          <div className="flex items-center gap-4 mb-8">
            <div className="h-px flex-1 bg-gray-900/10" />
            <h2 className="text-[10px] text-gray-400 font-light uppercase tracking-[0.3em]">尊享套餐</h2>
            <div className="h-px flex-1 bg-gray-900/10" />
          </div>
          <div className="space-y-6">
            {SUITES.map((suite, index) => (
              <motion.div
                key={suite.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="border border-gray-900/5 p-6 group hover:border-gray-900/10 transition-all bg-white/50 backdrop-blur-sm"
              >
                <div className="flex gap-6 items-center">
                  <div className="w-20 h-20 overflow-hidden flex-shrink-0 bg-gray-200">
                    <img src={suite.images[0]} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xs font-serif font-light text-gray-900 tracking-widest uppercase">{suite.name}</h3>
                      <span className="text-gray-400 text-[10px] font-light tracking-widest">{suite.price}</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {suite.features.slice(0, 2).map((feat, i) => (
                        <span key={i} className="text-[9px] text-gray-400 tracking-widest uppercase">
                          {feat}
                        </span>
                      ))}
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-gray-900 transition-colors" />
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

const SectionDetailPage = ({ onBack }: { onBack: () => void }) => {
  const id = useLocation().pathname.split('/').slice(-1)[0];
  const sections: {[key: string]: {title: string, image: string}} = {
    'env': { title: '爱儿美·环境', image: 'https://picsum.photos/seed/env_long/1080/3000' },
    'equip': { title: '爱儿美·器械', image: 'https://picsum.photos/seed/equip_long/1080/3000' },
    'meal': { title: '爱儿美·月子餐', image: 'https://picsum.photos/seed/meal_long/1080/3000' },
    'team': { title: '爱儿美·团队', image: 'https://picsum.photos/seed/team_long/1080/3000' },
  };
  const data = sections[id] || sections['env'];

  return (
    <div className="min-h-full bg-[#F5F5F0] relative">
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-900/5 p-6 flex items-center gap-4">
        <button onClick={onBack} className="text-gray-400 hover:text-gray-900 transition-colors">
          <ChevronRight className="w-6 h-6 rotate-180" />
        </button>
        <h1 className="text-sm font-serif font-light text-gray-900 tracking-[0.2em] uppercase">{data.title}</h1>
      </div>
      <div className="w-full">
        <img src={data.image} className="w-full h-auto" alt={data.title} referrerPolicy="no-referrer" />
      </div>
    </div>
  );
};

const AIChat = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  const [messages, setMessages] = useState<{ role: 'user' | 'ai', text: string }[]>([
    { role: 'ai', text: '您好！我是您的AI母婴专家，有什么可以帮您的吗？' }
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages([...messages, { role: 'user', text: input }]);
    setInput('');
    // Simulate AI response
    setTimeout(() => {
      setMessages(prev => [...prev, { role: 'ai', text: '这是一个模拟的AI回答。在实际应用中，我们将对接Gemini或其他AI模型来为您提供专业的母婴建议。' }]);
    }, 1000);
  };

  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 z-[200] bg-[#FFF9F9] flex flex-col">
      <div className="p-8 border-b border-rose-100 flex justify-between items-center bg-white/80 backdrop-blur-md sticky top-0">
        <h3 className="text-sm font-serif font-semibold text-rose-400 tracking-[0.1em]">AI 专家咨询</h3>
        <button onClick={onClose} className="text-rose-300 hover:text-rose-400 transition-colors">
          <X className="w-6 h-6" />
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-8 space-y-6 no-scrollbar">
        {messages.map((msg, i) => (
          <div key={i} className={cn("flex", msg.role === 'user' ? "justify-end" : "justify-start")}>
            <div className={cn(
              "max-w-[85%] p-5 text-xs leading-relaxed tracking-wide rounded-2xl shadow-sm",
              msg.role === 'user' 
                ? "bg-rose-400 text-white" 
                : "bg-white text-gray-700 border border-rose-50"
            )}>
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      <div className="p-8 border-t border-rose-100 bg-white/80 backdrop-blur-md">
        <div className="flex gap-2 mb-6 overflow-x-auto no-scrollbar pb-2">
          {['产后如何恢复？', '宝宝黄疸怎么办？', '月子餐怎么吃？'].map(q => (
            <button 
              key={q} 
              onClick={() => setInput(q)}
              className="bg-rose-50 text-rose-400 px-4 py-2 text-[10px] whitespace-nowrap rounded-full font-medium tracking-wide hover:bg-rose-100 transition-all"
            >
              {q}
            </button>
          ))}
        </div>
        <div className="flex gap-3">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="输入您的问题..."
            className="flex-1 bg-white border border-rose-100 rounded-2xl px-6 py-4 text-xs focus:border-rose-300 outline-none transition-all"
          />
          <button 
            onClick={handleSend}
            className="bg-rose-400 text-white w-14 h-14 rounded-2xl flex items-center justify-center hover:bg-rose-500 transition-all shadow-lg shadow-rose-200"
          >
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

const Typewriter = ({ text }: { text: string }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (index < text.length) {
      const timer = setTimeout(() => {
        setDisplayedText((prev) => prev + text[index]);
        setIndex((prev) => prev + 1);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [index, text]);

  return <span>{displayedText}</span>;
};

const ContentCenter = ({ onAction, profile }: { onAction: (path: string) => void, profile: UserProfile }) => {
  const [activeTab, setActiveTab] = useState('pregnancy');
  const [selectedQA, setSelectedQA] = useState<{q: string, a: string} | null>(null);
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);
  const tabs = [
    { id: 'pregnancy', label: '孕期' },
    { id: 'postpartum', label: '月子' },
    { id: 'parenting', label: '育儿' },
    { id: 'nanny', label: '月嫂' },
  ];

  const aiGreeting = "中午好，亲爱的宝妈。今天阳光明媚，正如您温柔的笑容。愿您在孕期的每一天都充满爱与期待，宝宝正感受着您的快乐呢。";

  return (
    <div className="pb-32 pt-10 bg-[#FFF9F9] min-h-full">
      <div className="px-8 mb-8">
        <h1 className="text-2xl font-serif font-semibold text-rose-400 mb-8 tracking-wide">内容中心</h1>
        
        {/* Daily Fortune / Reminder */}
        <section className="mb-8">
          <div className="relative overflow-hidden rounded-3xl bg-rose-50 p-8 text-gray-900 shadow-sm border border-rose-100">
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h2 className="text-2xl font-serif font-semibold text-rose-400 mb-1">今日好运签</h2>
                  <p className="text-[10px] text-rose-300 tracking-widest uppercase">Daily Fortune</p>
                </div>
                <div className="text-right text-rose-300">
                  <p className="text-3xl font-serif font-semibold">01</p>
                  <p className="text-[10px] tracking-widest uppercase">April</p>
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="flex gap-8">
                  <div className="flex-1">
                    <p className="text-[10px] text-rose-300 mb-2 tracking-widest uppercase">宜 / Suitable</p>
                    <p className="text-xs font-medium text-gray-700">散步、听音乐</p>
                  </div>
                  <div className="w-px bg-rose-200/50" />
                  <div className="flex-1">
                    <p className="text-[10px] text-rose-300 mb-2 tracking-widest uppercase">忌 / Avoid</p>
                    <p className="text-xs font-medium text-gray-700">过度劳累</p>
                  </div>
                </div>
                <div className="h-px bg-rose-200/30" />
                <div className="min-h-[80px]">
                  <p className="text-xs leading-relaxed text-gray-600">
                    <Typewriter text={aiGreeting} />
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Compact AI Q&A Section */}
        <section className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="h-px flex-1 bg-rose-100" />
            <span className="text-[10px] text-rose-300 font-medium uppercase tracking-widest">专家建议 & 问答</span>
            <div className="h-px flex-1 bg-rose-100" />
          </div>
          <div className="grid grid-cols-1 gap-3">
            {PRESET_QUESTIONS.slice(0, 2).map((item, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedQA(item)}
                className="flex items-center justify-between bg-white rounded-2xl px-6 py-4 text-left shadow-sm border border-rose-50 hover:border-rose-200 transition-all"
              >
                <span className="text-[11px] font-medium text-gray-600 truncate mr-4">{item.q}</span>
                <ArrowRight className="w-3 h-3 text-rose-200 flex-shrink-0" />
              </button>
            ))}
            <button
              onClick={() => setIsAIChatOpen(true)}
              className="flex items-center justify-between bg-rose-400 rounded-2xl px-6 py-4 text-left hover:bg-rose-500 transition-all shadow-lg shadow-rose-100"
            >
              <div className="flex items-center gap-3">
                <Sparkles className="w-3 h-3 text-white/80" />
                <span className="text-[11px] font-semibold text-white tracking-wide">AI 专家即刻解答</span>
              </div>
              <ArrowRight className="w-3 h-3 text-white/80 flex-shrink-0" />
            </button>
          </div>
        </section>

        <div className="grid grid-cols-4 gap-3 mb-8">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "py-3 text-[10px] font-semibold tracking-wide transition-all text-center uppercase rounded-full",
                activeTab === tab.id 
                  ? "bg-rose-400 text-white shadow-md shadow-rose-100" 
                  : "bg-white text-rose-300 border border-rose-50"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Article List */}
      <div className="px-6 space-y-8">
        {CONTENT_ITEMS.filter(post => post.category === activeTab).map((post, idx) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="group bg-white rounded-3xl overflow-hidden shadow-sm border border-rose-50"
          >
            <div className="aspect-[16/9] bg-gray-100 overflow-hidden relative">
              <img 
                src={post.cover} 
                alt={post.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                referrerPolicy="no-referrer"
              />
              {post.type === 'video' && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center">
                    <Play className="w-4 h-4 text-white fill-current" />
                  </div>
                </div>
              )}
            </div>
            <div className="p-6">
              <h3 className="text-sm font-semibold text-gray-800 mb-4 leading-relaxed">
                {post.title}
              </h3>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="text-[10px] font-medium text-rose-300">
                    {post.author}
                  </div>
                </div>
                <div className="flex items-center gap-1 text-rose-200">
                  <Heart className="w-3 h-3" />
                  <span className="text-[10px]">{post.likes}</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* QA Popup */}
      <AnimatePresence>
        {selectedQA && (
          <div className="absolute inset-0 z-[110] flex items-center justify-center px-6">
            <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setSelectedQA(null)} />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-3xl p-10 w-full max-w-sm relative z-10 shadow-2xl border border-rose-50"
            >
              <button 
                onClick={() => setSelectedQA(null)}
                className="absolute top-6 right-6 text-rose-200 hover:text-rose-400 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <h3 className="text-lg font-serif font-semibold text-rose-400 mb-6 leading-relaxed">{selectedQA.q}</h3>
              <div className="h-px bg-rose-100 mb-6" />
              <p className="text-xs text-gray-600 leading-relaxed tracking-wide">
                {selectedQA.a}
              </p>
              <button 
                onClick={() => setSelectedQA(null)}
                className="w-full mt-8 bg-rose-400 text-white py-4 rounded-2xl font-semibold text-[11px] tracking-widest uppercase shadow-lg shadow-rose-100"
              >
                我知道了
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AIChat isOpen={isAIChatOpen} onClose={() => setIsAIChatOpen(false)} />
    </div>
  );
};

const MemberCenter = () => {
  const navigate = useNavigate();
  const [articleIndex, setArticleIndex] = useState(0);

  const articles = [
    { title: 'ECHOES of HER', subtitle: '聆听她的新生之旅', desc: '开启杂志', image: 'https://picsum.photos/seed/mag1/400/400' },
    { title: 'BEYOND MOTHERHOOD', subtitle: '探索自我边界', desc: '开启杂志', image: 'https://picsum.photos/seed/mag2/400/400' }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setArticleIndex(prev => (prev + 1) % articles.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [articles.length]);

  return (
    <div className="min-h-full bg-[#F5F5F0] pb-32">
      {/* Header */}
      <div className="pt-16 pb-4 px-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-serif font-light text-gray-900 tracking-[0.3em] uppercase">AI ER MEI</h1>
        </div>

        <div className="flex items-center gap-8 mb-6">
          <div className="w-20 h-20 bg-white border border-gray-900/5 flex items-center justify-center text-gray-300 text-[10px] font-light tracking-widest shadow-sm">
            AVATAR
          </div>
          <div>
            <div className="bg-gray-900 text-white text-[8px] px-3 py-1 border border-gray-900 inline-block mb-3 font-light tracking-[0.2em] uppercase">
              GOLD MEMBER
            </div>
            <h2 className="text-lg font-serif font-light text-gray-900 tracking-[0.2em]">111房间号宝妈</h2>
          </div>
        </div>
      </div>

      {/* Main Sections */}
      <div className="px-8 space-y-8">
        {/* Top Service Boxes */}
        <section>
          <div className="flex items-center gap-4 mb-8">
            <div className="h-px flex-1 bg-gray-900/10" />
            <h3 className="text-[10px] text-gray-400 font-light uppercase tracking-[0.3em]">我的服务</h3>
            <div className="h-px flex-1 bg-gray-900/10" />
          </div>
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: '我的套餐', icon: Package, path: '/member-sub/package' },
              { label: '我的礼券', icon: Ticket, path: '/member-sub/coupon' },
              { label: '我的产康', icon: Heart, path: '/member-sub/postpartum' }
            ].map((item) => (
              <button 
                key={item.label}
                onClick={() => navigate(item.path)}
                className="aspect-square bg-white border border-gray-900/5 shadow-sm flex flex-col items-center justify-center gap-4 active:scale-95 transition-transform"
              >
                <div className="w-10 h-10 bg-gray-50 flex items-center justify-center">
                  <item.icon className="w-5 h-5 text-gray-400" />
                </div>
                <span className="text-[10px] font-light text-gray-700 tracking-widest uppercase">{item.label}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Featured Card - Scrolling Articles */}
        <div className="relative">
          <div className="bg-white overflow-hidden flex border border-gray-900/5 h-40 shadow-sm">
            <AnimatePresence mode="wait">
              <motion.div 
                key={articleIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex w-full"
              >
                <div className="w-1/2 relative overflow-hidden">
                  <img src={articles[articleIndex].image} className="w-full h-full object-cover opacity-80" />
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center p-4">
                    <p className="text-[10px] font-light tracking-[0.2em] mb-2 uppercase opacity-60">Featured</p>
                    <p className="text-[14px] font-serif font-light leading-tight tracking-widest drop-shadow-md">{articles[articleIndex].title}</p>
                  </div>
                </div>
                <div className="w-1/2 p-8 flex flex-col justify-center relative">
                  <h4 className="text-[11px] font-serif font-light text-gray-800 mb-4 tracking-widest leading-relaxed">{articles[articleIndex].subtitle}</h4>
                  <button className="text-[9px] text-gray-400 flex items-center gap-1 font-light tracking-[0.3em] uppercase">
                    {articles[articleIndex].desc} <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
          {/* Indicators */}
          <div className="flex justify-center gap-3 mt-6">
            {articles.map((_, i) => (
              <div 
                key={i} 
                className={cn(
                  "h-[1px] transition-all duration-700",
                  i === articleIndex ? "w-12 bg-gray-900" : "w-4 bg-gray-200"
                )}
              />
            ))}
          </div>
        </div>

        {/* Bottom List Items */}
        <div className="bg-white border border-gray-900/5 shadow-sm overflow-hidden divide-y divide-gray-900/5">
          {[
            { label: '服务热线', icon: Phone, path: '/member-sub/hotline' },
            { label: '服务及评价', icon: Star, path: '/member-sub/evaluation' },
            { label: '常见问题', icon: ShieldCheck, path: '/member-sub/faq' }
          ].map((item) => (
            <button 
              key={item.label}
              onClick={() => navigate(item.path)}
              className="w-full flex items-center justify-between p-6 active:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-5">
                <item.icon className="w-4 h-4 text-gray-400" />
                <span className="text-[11px] font-light text-gray-800 tracking-[0.2em] uppercase">{item.label}</span>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-200" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

const EvaluationPage = ({ onBack }: { onBack: () => void }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (rating === 0) return;
    setSubmitted(true);
    setTimeout(() => onBack(), 2000);
  };

  return (
    <div className="min-h-full bg-[#F5F5F0] pb-32 pt-16 px-8">
      <div className="flex items-center gap-4 mb-10">
        <button onClick={onBack} className="text-gray-400 hover:text-gray-900 transition-colors">
          <ChevronRight className="w-6 h-6 rotate-180" />
        </button>
        <h1 className="text-sm font-serif font-light text-gray-900 tracking-[0.3em] uppercase">服务和评价</h1>
      </div>

      {submitted ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-20 h-20 bg-white border border-gray-900/5 flex items-center justify-center mb-6 shadow-sm">
            <Star className="w-10 h-10 text-gray-900/20 fill-current" />
          </div>
          <h2 className="text-sm font-serif font-light text-gray-900 mb-2 tracking-[0.2em] uppercase">感谢您的评价</h2>
          <p className="text-[10px] text-gray-400 font-light tracking-widest uppercase">您的反馈是我们进步的动力</p>
        </div>
      ) : (
        <div className="space-y-10">
          <div className="bg-white border border-gray-900/5 p-8 text-center shadow-sm">
            <p className="text-gray-400 text-[10px] mb-6 tracking-widest uppercase">请为我们的服务打分</p>
            <div className="flex justify-center gap-4">
              {[1, 2, 3, 4, 5].map((s) => (
                <button 
                  key={s} 
                  onClick={() => setRating(s)}
                  className="transition-transform active:scale-90"
                >
                  <Star className={cn("w-8 h-8", s <= rating ? "text-gray-900 fill-current" : "text-gray-100")} />
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white border border-gray-900/5 p-8 shadow-sm">
            <p className="text-gray-400 text-[10px] mb-4 tracking-widest uppercase text-left">您的评价内容</p>
            <textarea 
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="请写下您的宝贵意见..."
              className="w-full bg-transparent border-none text-gray-900 text-xs font-light focus:ring-0 p-0 h-32 resize-none placeholder:text-gray-200 tracking-widest leading-relaxed"
            />
          </div>

          <button 
            onClick={handleSubmit}
            disabled={rating === 0}
            className={cn(
              "w-full py-5 text-[10px] font-light tracking-[0.4em] transition-all duration-500 uppercase",
              rating > 0 ? "bg-gray-900 text-white shadow-lg shadow-gray-900/10" : "bg-gray-100 text-gray-300 cursor-not-allowed"
            )}
          >
            提交评价
          </button>
        </div>
      )}
    </div>
  );
};

const HotlinePage = ({ onBack }: { onBack: () => void }) => {
  return (
    <div className="min-h-full bg-[#F5F5F0] pb-32 pt-16 px-8">
      <div className="flex items-center gap-4 mb-10">
        <button onClick={onBack} className="text-gray-400 hover:text-gray-900 transition-colors">
          <ChevronRight className="w-6 h-6 rotate-180" />
        </button>
        <h1 className="text-sm font-serif font-light text-gray-900 tracking-[0.3em] uppercase">服务热线</h1>
      </div>

      <div className="space-y-6">
        {[
          { label: '24小时尊享热线', number: '400-106-1080' },
          { label: '前台预约咨询', number: '010-8888-9999' },
          { label: '产康中心直连', number: '010-8888-6666' }
        ].map((item, i) => (
          <div key={i} className="bg-white border border-gray-900/5 p-8 flex justify-between items-center shadow-sm">
            <div>
              <p className="text-[10px] text-gray-400 mb-2 tracking-widest uppercase">{item.label}</p>
              <p className="text-lg font-serif font-light text-gray-900 tracking-widest">{item.number}</p>
            </div>
            <button className="w-12 h-12 bg-gray-900 flex items-center justify-center text-white hover:bg-gray-800 transition-all">
              <Phone className="w-5 h-5" />
            </button>
          </div>
        ))}
        
        <div className="bg-white border border-gray-900/5 p-8 text-center shadow-sm">
          <h3 className="text-[10px] text-gray-400 mb-6 tracking-widest uppercase">专属客服</h3>
          <div className="w-48 h-48 bg-gray-50 border border-gray-900/5 mx-auto mb-6 flex items-center justify-center">
            <div className="text-center">
              <QrCode className="w-24 h-24 text-gray-900/20 mx-auto mb-2" />
              <p className="text-[9px] text-gray-400 tracking-widest uppercase">长按识别二维码</p>
            </div>
          </div>
          <p className="text-[10px] text-gray-500 tracking-widest uppercase">添加您的专属私教顾问</p>
        </div>
      </div>
    </div>
  );
};

const FAQPage = ({ onBack }: { onBack: () => void }) => {
  return (
    <div className="min-h-full bg-[#F5F5F0] pb-32 pt-16 px-8">
      <div className="flex items-center gap-4 mb-10">
        <button onClick={onBack} className="text-gray-400 hover:text-gray-900 transition-colors">
          <ChevronRight className="w-6 h-6 rotate-180" />
        </button>
        <h1 className="text-sm font-serif font-light text-gray-900 tracking-[0.3em] uppercase">常见问题</h1>
      </div>

      <div className="bg-white border border-gray-900/5 shadow-sm overflow-hidden divide-y divide-gray-900/5">
        <button className="w-full flex items-center justify-between p-8 active:bg-gray-50 transition-colors">
          <span className="text-[11px] font-light text-gray-800 tracking-[0.2em] uppercase">我的孕期</span>
          <ChevronRight className="w-4 h-4 text-gray-200" />
        </button>
        <button className="w-full flex items-center justify-between p-8 active:bg-gray-50 transition-colors">
          <div className="text-left">
            <p className="text-[11px] font-light text-gray-800 tracking-[0.2em] mb-1 uppercase">常见问题</p>
            <p className="text-[9px] text-gray-400 tracking-widest uppercase">隐私条款及账户问题</p>
          </div>
          <ChevronRight className="w-4 h-4 text-gray-200" />
        </button>
      </div>
    </div>
  );
};

const SuiteDetails = ({ onBack }: { onBack: () => void }) => {
  const [selectedSuite, setSelectedSuite] = useState<typeof SUITES[0] | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  return (
    <div className="pb-32 pt-10 px-8 bg-[#F5F5F0] min-h-full">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={onBack} className="text-gray-400 hover:text-gray-900 transition-colors">
          <ChevronRight className="w-6 h-6 rotate-180" />
        </button>
        <h1 className="text-sm font-serif font-light text-gray-900 tracking-[0.3em] uppercase">房型套餐</h1>
      </div>

      <div className="space-y-6">
        {SUITES.map((suite) => (
          <motion.div
            key={suite.id}
            whileTap={{ scale: 0.98 }}
            onClick={() => setSelectedSuite(suite)}
            className="bg-white border border-gray-900/5 overflow-hidden shadow-sm"
          >
            <div className="aspect-video bg-gray-100 flex items-center justify-center text-[10px] text-gray-300 font-bold uppercase relative">
              <img 
                src={suite.images[0]} 
                alt={suite.name} 
                className="absolute inset-0 w-full h-full object-cover opacity-80"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-black/10" />
              <span className="relative z-10 text-white drop-shadow-md tracking-widest text-[9px] uppercase">房型封面图线框</span>
            </div>
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-sm font-serif font-light text-gray-900 tracking-widest uppercase">{suite.name}</h3>
                  <p className="text-[10px] text-gray-400 tracking-widest uppercase mt-1">{suite.size} · {suite.features.join(' | ')}</p>
                </div>
                <span className="text-xs font-serif font-light text-gray-900 tracking-widest">{suite.price}</span>
              </div>
              <button className="w-full bg-gray-900 text-white py-3 text-[9px] font-light tracking-[0.3em] uppercase hover:bg-gray-800 transition-all">查看详情</button>
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
            className="absolute inset-0 z-[130] bg-[#F5F5F0] overflow-y-auto no-scrollbar"
          >
            <div className="relative h-[45vh] bg-gray-800 group">
              <button 
                onClick={() => setSelectedSuite(null)}
                className="absolute top-12 left-8 z-20 bg-white/20 backdrop-blur-md text-white p-2 hover:bg-white/30 transition-all"
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
                    className="absolute inset-0 w-full h-full object-cover opacity-80"
                    referrerPolicy="no-referrer"
                  />
                </AnimatePresence>
                <div className="absolute inset-0 bg-black/20" />
                
                {/* Carousel Controls */}
                <div className="absolute inset-0 flex items-center justify-between px-4 z-10">
                  <button 
                    onClick={() => setCurrentImageIndex(prev => (prev - 1 + selectedSuite.images.length) % selectedSuite.images.length)}
                    className="p-2 bg-white/10 backdrop-blur-sm text-white/50 hover:text-white transition-all"
                  >
                    <ChevronRight className="w-5 h-5 rotate-180" />
                  </button>
                  <button 
                    onClick={() => setCurrentImageIndex(prev => (prev + 1) % selectedSuite.images.length)}
                    className="p-2 bg-white/10 backdrop-blur-sm text-white/50 hover:text-white transition-all"
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
                        "h-1 transition-all duration-500",
                        i === currentImageIndex ? "w-4 bg-white" : "w-1 bg-white/30"
                      )}
                    />
                  ))}
                </div>

                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
              </div>
            </div>

            <div className="p-8 space-y-8 bg-[#F5F5F0]">
              <div>
                <h2 className="text-xl font-serif font-light text-gray-900 tracking-[0.2em] uppercase mb-4">{selectedSuite.name}</h2>
                <div className="flex flex-wrap gap-2 mb-4">
                  {selectedSuite.features.map(f => (
                    <span key={f} className="bg-white text-gray-400 text-[9px] px-3 py-1 border border-gray-900/5 tracking-widest uppercase">{f}</span>
                  ))}
                </div>
                <p className="text-gray-900 text-lg font-serif font-light tracking-widest">{selectedSuite.price}</p>
              </div>

              <div className="space-y-8">
                <section>
                  <h4 className="text-[10px] font-light text-gray-400 uppercase tracking-widest mb-4">房型介绍</h4>
                  <p className="text-[11px] text-gray-600 leading-relaxed tracking-widest font-light uppercase">
                    该房型由国际知名设计师团队打造，融合了现代极简主义与母婴人体工程学。全屋配备智能恒温恒湿系统，独立育婴区与休息区分离，确保产妇与新生儿的私密与安静。
                  </p>
                </section>

                <section>
                  <h4 className="text-[10px] font-light text-gray-400 uppercase tracking-widest mb-4">配套设施</h4>
                  <div className="grid grid-cols-2 gap-4">
                    {['24h呼叫系统','智能马桶','空气净化器','专业护理床'].map(i => (
                      <div key={i} className="flex items-center gap-3 bg-white border border-gray-900/5 p-4 shadow-sm">
                        <div className="w-1 h-1 bg-gray-900" />
                        <span className="text-[10px] text-gray-600 tracking-widest uppercase">{i}</span>
                      </div>
                    ))}
                  </div>
                </section>

                <button className="w-full bg-gray-900 text-white py-5 text-[10px] font-light tracking-[0.4em] uppercase hover:bg-gray-800 transition-all shadow-lg shadow-gray-900/10">立即预约看房</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const ComplaintPage = ({ onBack }: { onBack: () => void }) => {
  const [type, setType] = useState('服务质量');
  const [content, setContent] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (!content) return;
    setSubmitted(true);
    setTimeout(() => onBack(), 2000);
  };

  return (
    <div className="min-h-full bg-[#F5F5F0] pb-32 pt-16 px-8">
      <div className="flex items-center gap-4 mb-10">
        <button onClick={onBack} className="text-gray-400 hover:text-gray-900 transition-colors">
          <ChevronRight className="w-6 h-6 rotate-180" />
        </button>
        <h1 className="text-sm font-serif font-light text-gray-900 tracking-[0.3em] uppercase">投诉建议</h1>
      </div>

      {submitted ? (
        <div className="bg-white border border-gray-900/5 p-12 text-center shadow-sm">
          <div className="w-16 h-16 bg-gray-900 flex items-center justify-center mx-auto mb-6">
            <Check className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-sm font-serif font-light text-gray-900 tracking-widest uppercase mb-2">提交成功</h2>
          <p className="text-[10px] text-gray-400 tracking-widest uppercase">我们会尽快处理您的反馈</p>
        </div>
      ) : (
        <div className="space-y-8">
          <div className="bg-white border border-gray-900/5 p-8 shadow-sm">
            <p className="text-[10px] text-gray-400 mb-6 uppercase tracking-[0.2em]">反馈类型</p>
            <div className="grid grid-cols-2 gap-3">
              {['服务质量', '设施环境', '餐饮建议', '其他'].map(t => (
                <button 
                  key={t}
                  onClick={() => setType(t)}
                  className={cn(
                    "py-3 text-[11px] font-light tracking-widest transition-all uppercase border",
                    type === t ? "bg-gray-900 text-white border-gray-900 shadow-lg shadow-gray-900/10" : "bg-white text-gray-400 border-gray-900/5"
                  )}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white border border-gray-900/5 p-8 shadow-sm">
            <p className="text-[10px] text-gray-400 mb-4 uppercase tracking-[0.2em]">详细描述</p>
            <textarea 
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="请详细描述您的问题或建议..."
              className="w-full bg-transparent border-none text-gray-700 text-xs font-light focus:ring-0 p-0 h-40 resize-none placeholder:text-gray-200 tracking-widest leading-relaxed uppercase"
            />
          </div>

          <button 
            onClick={handleSubmit}
            disabled={!content}
            className={cn(
              "w-full py-5 text-[10px] font-light tracking-[0.4em] transition-all duration-500 uppercase",
              content ? "bg-gray-900 text-white shadow-lg shadow-gray-900/10" : "bg-gray-100 text-gray-300 cursor-not-allowed"
            )}
          >
            提交反馈
          </button>
        </div>
      )}
    </div>
  );
};

const CouponPage = ({ onBack }: { onBack: () => void }) => {
  const coupons = [
    { id: 1, name: '产后康复代金券', value: '¥500', expiry: '2026-12-31', status: '未使用' },
    { id: 2, name: '新生儿摄影券', value: '¥200', expiry: '2026-06-30', status: '未使用' },
    { id: 3, name: '月子餐升级券', value: '¥300', expiry: '2026-03-31', status: '已过期' }
  ];

  return (
    <div className="min-h-full bg-[#F5F5F0] pb-32 pt-16 px-8">
      <div className="flex items-center gap-4 mb-10">
        <button onClick={onBack} className="text-gray-400 hover:text-gray-900 transition-colors">
          <ChevronRight className="w-6 h-6 rotate-180" />
        </button>
        <h1 className="text-sm font-serif font-light text-gray-900 tracking-[0.3em] uppercase">我的礼券</h1>
      </div>

      <div className="space-y-4">
        {coupons.map(coupon => (
          <div key={coupon.id} className="bg-white border border-gray-900/5 p-6 flex justify-between items-center relative overflow-hidden shadow-sm">
            <div className={cn(
              "absolute left-0 top-0 bottom-0 w-1",
              coupon.status === '未使用' ? "bg-gray-900" : "bg-gray-200"
            )} />
            <div>
              <h3 className="text-[11px] font-light text-gray-800 mb-1 tracking-widest uppercase">{coupon.name}</h3>
              <p className="text-[9px] text-gray-400 tracking-widest uppercase">有效期至: {coupon.expiry}</p>
            </div>
            <div className="text-right">
              <p className={cn("text-lg font-serif font-light mb-1 tracking-widest", coupon.status === '未使用' ? "text-gray-900" : "text-gray-300")}>{coupon.value}</p>
              <span className={cn("text-[8px] px-2 py-0.5 border tracking-widest uppercase", 
                coupon.status === '未使用' ? "text-gray-900 border-gray-900/10 bg-gray-50" : "text-gray-300 border-gray-100 bg-gray-50"
              )}>
                {coupon.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const PostpartumPage = ({ onBack }: { onBack: () => void }) => {
  const services = [
    { id: 1, name: '骨盆修复', time: '2026-04-10 14:00', status: '待执行', expert: '张老师' },
    { id: 2, name: '腹直肌修复', time: '2026-04-15 10:00', status: '待执行', expert: '李老师' },
    { id: 3, name: '乳腺疏通', time: '2026-03-25 15:00', status: '已完成', expert: '王老师' }
  ];

  return (
    <div className="min-h-full bg-[#F5F5F0] pb-32 pt-16 px-8">
      <div className="flex items-center gap-4 mb-10">
        <button onClick={onBack} className="text-gray-400 hover:text-gray-900 transition-colors">
          <ChevronRight className="w-6 h-6 rotate-180" />
        </button>
        <h1 className="text-sm font-serif font-light text-gray-900 tracking-[0.3em] uppercase">我的产康</h1>
      </div>

      <div className="space-y-6">
        {services.map(service => (
          <div key={service.id} className="bg-white border border-gray-900/5 p-8 shadow-sm">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-sm font-serif font-light text-gray-900 mb-1 tracking-widest uppercase">{service.name}</h3>
                <p className="text-[10px] text-gray-400 tracking-widest uppercase">服务专家: {service.expert}</p>
              </div>
              <span className={cn(
                "text-[9px] px-3 py-1 font-light tracking-widest uppercase border",
                service.status === '待执行' ? "text-gray-900 border-gray-900/10 bg-gray-50" : "text-gray-300 border-gray-100 bg-gray-50"
              )}>
                {service.status}
              </span>
            </div>
            <div className="flex items-center gap-2 text-[10px] text-gray-500 tracking-widest uppercase">
              <Calendar className="w-3 h-3" />
              <span>预约时间: {service.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const MemberSubPage = ({ onBack }: { onBack: () => void }) => {
  const location = useLocation();
  const path = location.pathname;

  if (path === '/member-sub/evaluation') return <EvaluationPage onBack={onBack} />;
  if (path === '/member-sub/faq') return <FAQPage onBack={onBack} />;
  if (path === '/member-sub/package') return <SuiteDetails onBack={onBack} />;
  if (path === '/member-sub/hotline') return <HotlinePage onBack={onBack} />;
  if (path === '/member-sub/coupon') return <CouponPage onBack={onBack} />;
  if (path === '/member-sub/postpartum') return <PostpartumPage onBack={onBack} />;

  return (
    <div className="min-h-full bg-[#F5F5F0] pb-32 pt-16 px-8">
      <div className="flex items-center gap-4 mb-10">
        <button onClick={onBack} className="text-gray-400 hover:text-gray-900 transition-colors">
          <ChevronRight className="w-6 h-6 rotate-180" />
        </button>
        <h1 className="text-sm font-serif font-light text-gray-900 tracking-[0.3em] uppercase">详情</h1>
      </div>

      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-20 h-20 bg-white border border-gray-900/5 flex items-center justify-center mb-6 shadow-sm">
          <div className="w-10 h-10 border border-gray-100 border-t-gray-900 animate-spin" />
        </div>
        <p className="text-gray-400 text-[10px] tracking-widest uppercase">内容正在同步中...</p>
      </div>
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
    <div className="min-h-screen bg-[#F5F5F0] p-8">
      <div className="max-w-4xl mx-auto">
        <header className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-2xl font-serif font-light text-gray-900 tracking-[0.2em] uppercase">智能管理后台</h1>
            <p className="text-[10px] text-gray-500 tracking-widest uppercase mt-2">爱儿美 Agent 客户路径追踪与分析</p>
          </div>
          <div className="flex gap-4">
            <div className="bg-white px-6 py-3 border border-gray-900/5 shadow-sm flex items-center gap-3">
              <Users className="w-4 h-4 text-gray-900" />
              <span className="text-[10px] font-light tracking-widest uppercase">活跃客户: 124</span>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-3 gap-8 mb-12">
          <div className="bg-white p-8 border border-gray-900/5 shadow-sm">
            <BarChart3 className="w-6 h-6 text-gray-400 mb-4" />
            <p className="text-gray-400 text-[9px] uppercase tracking-widest mb-1">平均停留时长</p>
            <p className="text-xl font-serif font-light text-gray-900 tracking-widest">12.5 min</p>
          </div>
          <div className="bg-white p-8 border border-gray-900/5 shadow-sm">
            <TrendingUp className="w-6 h-6 text-gray-400 mb-4" />
            <p className="text-gray-400 text-[9px] uppercase tracking-widest mb-1">新留资比</p>
            <p className="text-xl font-serif font-light text-gray-900 tracking-widest">42%</p>
          </div>
          <div className="bg-white p-8 border border-gray-900/5 shadow-sm">
            <Sparkles className="w-6 h-6 text-gray-400 mb-4" />
            <p className="text-gray-400 text-[9px] uppercase tracking-widest mb-1">热门内容榜单</p>
            <p className="text-xl font-serif font-light text-gray-900 tracking-widest">行政套房揭秘</p>
          </div>
        </div>

        <div className="bg-white border border-gray-900/5 shadow-sm overflow-hidden">
          <div className="p-8 border-b border-gray-50 flex justify-between items-center">
            <h2 className="text-sm font-serif font-light tracking-[0.2em] uppercase">当前客户画像分析</h2>
            <button 
              onClick={handleAnalyze}
              disabled={loading}
              className="bg-gray-900 text-white px-6 py-3 text-[10px] font-light tracking-widest uppercase flex items-center gap-2 disabled:opacity-50 transition-colors hover:bg-gray-800"
            >
              {loading ? "分析中..." : "重新分析路径"} <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          
          <div className="p-8">
            <div className="mb-8">
              <h3 className="text-[9px] font-light text-gray-400 uppercase tracking-widest mb-4">浏览路径追踪</h3>
              <div className="flex flex-wrap gap-3">
                {profile.paths.map((p, i) => (
                  <React.Fragment key={i}>
                    <div className="bg-gray-50 px-4 py-2 text-[10px] text-gray-600 border border-gray-900/5 tracking-widest uppercase">
                      {p.path}
                    </div>
                    {i < profile.paths.length - 1 && <ChevronRight className="w-3 h-3 self-center text-gray-300" />}
                  </React.Fragment>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8">
              <div>
                <h3 className="text-[9px] font-light text-gray-400 uppercase tracking-widest mb-4">智能标签 (Agent)</h3>
                <div className="flex flex-wrap gap-2">
                  {(analysis?.tags || profile.tags).map((tag, i) => (
                    <span key={i} className="text-gray-900 px-4 py-1.5 text-[9px] font-light border border-gray-900/10 tracking-widest uppercase bg-gray-50">
                      #{tag}
                    </span>
                  ))}
                  {(!analysis && profile.tags.length === 0) && <span className="text-gray-400 text-[10px] italic tracking-widest uppercase">暂无标签</span>}
                </div>
              </div>
              <div>
                <h3 className="text-[9px] font-light text-gray-400 uppercase tracking-widest mb-4">销售建议话术</h3>
                <div className="bg-gray-50 p-6 border border-gray-900/5">
                  <p className="text-[10px] text-gray-600 leading-relaxed italic tracking-widest uppercase">
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
    <div className="min-h-screen bg-[#F5F5F0] flex items-center justify-center p-4 md:p-8 font-serif text-gray-900 selection:bg-gray-200">
      
      {/* iPhone 16 Frame Wrapper */}
      <div className="relative w-full max-w-[393px] aspect-[393/852] bg-black rounded-[55px] shadow-[0_0_0_12px_#1a1a1a,0_30px_60px_-15px_rgba(0,0,0,0.3)] overflow-hidden border-[8px] border-[#1a1a1a]">
        
        {/* Dynamic Island */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-7 bg-black rounded-full z-50 flex items-center justify-center">
          <div className="w-2 h-2 bg-[#1a1a1a] rounded-full absolute right-4" />
        </div>

        {/* Screen Content */}
        <div className="relative w-full h-full bg-[#F5F5F0] rounded-[40px] overflow-hidden">
          {/* Scrollable Content Area */}
          <div className="w-full h-full overflow-y-auto no-scrollbar pb-24">
            <Routes>
              <Route path="/" element={<HomePage onAction={trackAction} />} />
              <Route path="/poster/:id" element={<PosterDetailPage onBack={() => navigate(-1)} />} />
              <Route path="/center" element={<ConfinementCenterPage onBack={() => navigate(-1)} />} />
              <Route path="/center/:id" element={<SectionDetailPage onBack={() => navigate(-1)} />} />
              <Route path="/content" element={<ContentCenter onAction={trackAction} profile={userProfile} />} />
              <Route path="/member" element={<MemberCenter onAction={trackAction} />} />
              <Route path="/member-sub/:id" element={<MemberSubPage onBack={() => navigate(-1)} />} />
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
        className="fixed top-6 right-6 bg-white shadow-lg p-4 rounded-2xl border border-gray-100 text-gray-400 hover:text-rose-300 transition-all z-50 flex items-center gap-2 group"
        title="管理后台"
      >
        <BarChart3 className="w-6 h-6" />
        <span className="text-sm font-bold text-gray-900 opacity-0 group-hover:opacity-100 transition-opacity">智能后台</span>
      </Link>
    </div>
  );
}
