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