export class AppConstants {
  public static BASE_API_URL = 'http://localhost:5000/api';

  public static API_USER_URL = AppConstants.BASE_API_URL + '/User';
  public static API_PROFILE_PICTURE_URL = AppConstants.BASE_API_URL + '/ProfilePicture';
  public static API_FRIENDS_URL = AppConstants.BASE_API_URL + '/Friends';
  public static API_USER_LOGIN_URL = AppConstants.API_USER_URL + '/login';
  public static API_USER_REGISTER_URL = AppConstants.API_USER_URL + '/register';

  public static API_LANGUAGE_URL = AppConstants.BASE_API_URL + '/Language';
  public static API_TECHNOLOGY_URL = AppConstants.BASE_API_URL + '/Technology';

  public static API_POST_URL = AppConstants.BASE_API_URL + '/Post';
  public static API_RATING_URL = AppConstants.BASE_API_URL + '/Rating';
  public static API_FEED_URL = AppConstants.BASE_API_URL + '/Feed';
  public static API_COMMENT_URL = AppConstants.BASE_API_URL + '/Comment';

  public static PAGE_SIZE = 10;
  public static FALLBACK_PROFILE_ICON = 'assets/icons/tabler-icon-user.svg';

  public static SESSION_TOKEN_KEY = 'UserCred';
  public static ADMIN_ROLE_NAME = 'Admin';
}
