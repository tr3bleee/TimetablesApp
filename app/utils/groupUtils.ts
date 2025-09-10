type SpecializationInfo = {
  color: string;
  label: string;
};

const SPECIALIZATIONS: Record<string, SpecializationInfo> = {
  'ИСИП': {
    color: '#7F61DD', // Фиолетовый
    label: 'Информационные системы и программирование'
  },
  'СИСА': {
    color: '#61DDBC', // Бирюзовый
    label: 'Системное и сетевое администрирование'
  },
  'Д': {
    color: '#DD61A7', // Розовый
    label: 'Дизайн'
  },
  'Р': {
    color: '#61B2DD', // Голубой
    label: 'Реклама'
  },
  'ОДФ': {
    color: '#DDB761', // Оранжевый
    label: '' // Без описания для ОДФ
  }
};

export const getSpecializationColor = (groupName: string): string => {
  // Извлекаем код специализации до точки
  // Например: "01-24.ИСИП.ОФ 9" -> "ИСИП"
  const match = groupName.match(/\.([^.]+)\./);
  if (match && SPECIALIZATIONS[match[1]]) {
    return SPECIALIZATIONS[match[1]].color;
  }

  // Для групп без точек пробуем найти код в начале
  const specialization = Object.keys(SPECIALIZATIONS).find(
    spec => groupName.toUpperCase().includes(spec)
  );
  return specialization ? SPECIALIZATIONS[specialization].color : '#999999';
};

export const getSpecializationLabel = (groupName: string): string => {
  // Аналогичная логика для получения метки
  const match = groupName.match(/\.([^.]+)\./);
  if (match && SPECIALIZATIONS[match[1]]) {
    return SPECIALIZATIONS[match[1]].label;
  }

  const specialization = Object.keys(SPECIALIZATIONS).find(
    spec => groupName.toUpperCase().includes(spec)
  );
  return specialization ? SPECIALIZATIONS[specialization].label : '';
};

export const getGroupLogo = (groupName: string): string => {
  // Извлекаем символ для логотипа группы
  // Поддерживаем разные форматы:
  // "15.ИСИП.25.ОФ.0.1.ХК" -> "Г" (нейтральный символ для групп нового формата)
  // "15.ИСИП.22.О-ЗФ.0.1.ХК" -> "Г" 
  // "П-1" -> "П"
  // "01-24.ИСИП.ОФ 9" -> "01"
  
  // Проверяем, является ли это группой нового формата (с точками)
  const hasNewFormat = /^\d+\.[^.]+\./.test(groupName);
  
  if (hasNewFormat) {
    // Для групп нового формата используем нейтральный символ "Г" (Группа)
    return "A";
  }
  
  // Для старого формата пробуем найти первые цифры
  const firstNumberMatch = groupName.match(/^(\d+)/);
  if (firstNumberMatch) {
    return firstNumberMatch[1];
  }
  
  // Если цифр в начале нет, используем старую логику (часть до тире)
  return groupName.split('-')[0];
}; 