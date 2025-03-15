from authemail.forms import EmailUserCreationForm, UserChangeForm
from django.contrib.auth import get_user_model
#from models import ProfessionGroup


class CastomEmailUserChangeForm(UserChangeForm):
    """ кастомная форма для админки для пользователя """
    class Meta:
        model = get_user_model()
        fields = '__all__'

    def __init__(self, *args, **kwargs):
        super(CastomEmailUserChangeForm, self).__init__(*args, **kwargs)
        if 'username' in self.fields:
            del self.fields['username']


    def save(self, commit=True):
        #ProfessionGroup.object.create()
        print((self.instance.profession_id))
        print((self.instance.pk))
        return super(CastomEmailUserChangeForm, self).save(commit=False)
