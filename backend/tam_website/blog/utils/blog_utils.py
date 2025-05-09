from datetime import datetime
from django.utils import timezone
from humanize import naturaltime
from django.utils.translation import get_language


def persian_digits(number: int) -> str:
    """Convert English digits to Persian digits"""
    persian_digits_map = {
        '0': '۰',
        '1': '۱',
        '2': '۲',
        '3': '۳',
        '4': '۴',
        '5': '۵',
        '6': '۶',
        '7': '۷',
        '8': '۸',
        '9': '۹'
    }
    return ''.join(persian_digits_map[digit] for digit in str(number))


def get_persian_date(date_obj):
    """Persian style: 25 اسفند 1402"""
    if hasattr(date_obj, 'created_date'):
        months = {
            1: 'فروردین',
            2: 'اردیبهشت', 
            3: 'خرداد',
            4: 'تیر',
            5: 'مرداد',
            6: 'شهریور',
            7: 'مهر',
            8: 'آبان',
            9: 'آذر',
            10: 'دی',
            11: 'بهمن',
            12: 'اسفند'
        }
        day = date_obj.created_date.day
        month = months[date_obj.created_date.month]
        year = date_obj.created_date.year
        return f"{persian_digits(day)} {month} {persian_digits(year)}"
    return None


def filter_vocabulary(text: str, length: int) -> str:
    """Filter the vocabulary of the text to the length"""
    filterd_text = text.split(' ')
    return ' '.join(filterd_text[:length]) + '...' if len(filterd_text) > length else text

    
def get_time_ago(date_obj):
    """Returns a human readable time difference in Persian"""
    if not hasattr(date_obj, 'created_date'):
        raise ValueError("date_obj must have a created_date attribute")

    lang = get_language()

    diff = timezone.now() - date_obj.created_date
    return naturaltime(diff) if lang == 'en' else time_ago_persian_format(naturaltime(diff))



def time_ago_persian_format(time_string: str) -> str:
    """Returns a human readable time difference in Persian"""
    
    persian_time_vocabulary = {
        'seconds': 'ثانیه',
        'minutes': 'دقیقه',
        'hours': 'ساعت',
        'days': 'روز',
        'month': 'ماه',
        'years': 'سال'
    }
    if time_string.startswith("a"):
        time_string = time_string.replace("a", "1")

    time_number, vocab_format, suffix = time_string.split(' ')

    for key, persian_format in persian_time_vocabulary.items():
        if key == vocab_format:
            persian_number = persian_digits(int(time_number))
            return f"پیش {persian_format} {persian_number}"
        
    raise ValueError(f"Unknown naturaltime format! {time_string}")
