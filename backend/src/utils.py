import datetime

import pytz


def get_current_utc_time():
    """Get the current UTC time."""
    utc_now = datetime.datetime.now(pytz.UTC)
    return utc_now.strftime("%Y-%m-%dT%H:%M:%SZ")
