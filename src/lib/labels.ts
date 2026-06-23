export function getPointLogTypeLabel(type: string) {
  switch (type) {
    case "REGISTER_REWARD":
      return "注册奖励";
    case "INVITE_REWARD":
      return "邀请奖励";
    case "ACTIVITY_REWARD":
      return "活动奖励";
    case "MANUAL_GRANT":
      return "手动发放";
    case "MANUAL_DEDUCT":
      return "手动扣减";
    case "LOCK_REWARD":
      return "锁仓返还";
    case "SYSTEM_ADJUST":
      return "系统调整";
    default:
      return type;
  }
}

export function getUserStatusLabel(status: string) {
  switch (status) {
    case "ACTIVE":
      return "正常";
    case "FROZEN":
      return "冻结";
    default:
      return status;
  }
}

export function getLockStatusLabel(status: string) {
  switch (status) {
    case "ACTIVE":
      return "锁仓中";
    case "RELEASED":
      return "已释放";
    default:
      return status;
  }
}

export function getPredictionStatusLabel(status: string) {
  switch (status) {
    case "DRAFT":
      return "草稿";
    case "PUBLISHED":
      return "已发布";
    case "UNPUBLISHED":
      return "已下架";
    case "EXPIRED":
      return "已过期";
    default:
      return status;
  }
}

export function getAnnouncementStatusLabel(status: string) {
  switch (status) {
    case "DRAFT":
      return "草稿";
    case "PUBLISHED":
      return "已发布";
    default:
      return status;
  }
}

export function formatReleaseRatioPercent(value: number) {
  return `${value}%`;
}
