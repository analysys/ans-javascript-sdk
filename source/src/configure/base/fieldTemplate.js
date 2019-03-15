/**
 * SDK 基础字段定义表
 * base.outer：上报日志基础结构定义
 * base.xcontext:上报报文找中xcontext下的共有字段定义
 * $开头的字段为各个事件特殊拥有字段
 */
export default {
    "base": {
        "outer": [
            "appid",
            "xwho",
            "xwhat",
            "xwhen",
            "xcontext"
        ],
        "xcontext": [
            "$lib",
            "$lib_version",
            "$platform",
            "$debug",
            "$is_login"
        ]
    },
    "$startup": {
        "xcontext": [
            "$screen_width",
            "$screen_height",
            "$model",
            "$os",
            "$os_version",
            "$web_crawler",
            "$browser",
            "$browser_version",
            "$time_zone",
            "$language",
            "$session_id",
            "$is_first_time",
            "$is_first_day",
            "$brand",
            "$utm_campaign_id",
            "$utm_source",
            "$utm_medium",
            "$utm_term",
            "$utm_content",
            "$utm_campaign",
            "$is_time_calibrated"
        ]
    },
    "$track": {
        "xcontext": [
            "$os",
            "$screen_width",
            "$screen_height",
            "$web_crawler",
            "$os_version",
            "$browser",
            "$browser_version",
            "$time_zone",
            "$language",
            "$is_first_day",
            "$session_id",
            "$utm_campaign_id",
            "$utm_source",
            "$utm_medium",
            "$utm_term",
            "$utm_content",
            "$utm_campaign",
            "$time_calibration"
        ]
    },
    "$pageview": {
        "xcontext": [
            "$os",
            "$screen_width",
            "$screen_height",
            "$web_crawler",
            "$brand",
            "$os_version",
            "$browser",
            "$browser_version",
            "$time_zone",
            "$language",
            "$session_id",
            "$is_first_day",
            "$referrer",
            "$referrer_domain",
            "$title",
            "$url",
            "$startup_time",
            "$utm_campaign_id",
            "$utm_source",
            "$utm_medium",
            "$utm_term",
            "$utm_content",
            "$utm_campaign",
            "$time_calibration"
        ]
    },
    "$alias": {
        "xcontext": [
            "$original_id",
        ]
    }
}